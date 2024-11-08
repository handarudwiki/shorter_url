import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  GoneException,
} from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma';
import { CreateUrlDto } from './dto/create_url.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UrlService {
  constructor(
    private readonly pirsmasService: PrismaService,
    @Inject(CACHE_MANAGER) private chacheManeger: Cache,
  ) {}

  async createShortUrl(createUrlDto: CreateUrlDto) {
    const { original_url, custom_code } = createUrlDto;

    const shortUrl = custom_code || Math.random().toString(36).substring(2, 8);

    const codeExist = await this.pirsmasService.url.findUnique({
      where: {
        short_url: shortUrl,
      },
    });

    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 5);

    if (codeExist) {
      throw new ConflictException('Short code already exist');
    }

    const newUrl = await this.pirsmasService.url.create({
      data: {
        origin_url: original_url,
        short_url: shortUrl,
        expiration_date: expirationDate,
      },
    });

    return {
      data: newUrl,
    };
  }

  async getOriginUrl(shortUrl: string): Promise<string> {
    const cacheUrl = await this.chacheManeger.get<string>(shortUrl);

    if (cacheUrl) {
      return cacheUrl;
    }

    const url = await this.pirsmasService.url.findUnique({
      where: {
        short_url: shortUrl,
      },
    });

    if (!url) {
      throw new NotFoundException('Url not found');
    }

    if (new Date() > url.expiration_date) {
      await this.pirsmasService.url.delete({
        where: {
          short_url: shortUrl,
        },
      });
      throw new GoneException('Url expired');
    }
    await this.chacheManeger.set(shortUrl, url.origin_url, 3600);
    return url.origin_url;
  }
}
