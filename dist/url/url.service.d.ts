import { PrismaService } from 'src/providers/prisma';
import { CreateUrlDto } from './dto/create_url.dto';
import { Cache } from 'cache-manager';
export declare class UrlService {
    private readonly pirsmasService;
    private chacheManeger;
    constructor(pirsmasService: PrismaService, chacheManeger: Cache);
    createShortUrl(createUrlDto: CreateUrlDto): Promise<{
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            short_url: string;
            origin_url: string;
            expiration_date: Date;
        };
    }>;
    getOriginUrl(shortUrl: string): Promise<string>;
}
