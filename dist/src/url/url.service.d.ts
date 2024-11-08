import { PrismaService } from 'src/providers/prisma';
import { CreateUrlDto } from './dto/create_url.dto';
import { Cache } from 'cache-manager';
export declare class UrlService {
    private readonly pirsmasService;
    private chacheManeger;
    constructor(pirsmasService: PrismaService, chacheManeger: Cache);
    createShortUrl(createUrlDto: CreateUrlDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        origin_url: string;
        short_url: string;
        expiration_date: Date;
    }>;
    getOriginUrl(shortUrl: string): Promise<string>;
}
