import { Response } from 'express';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create_url.dto';
export declare class UrlController {
    private readonly urlService;
    constructor(urlService: UrlService);
    createShortUrl(urlDto: CreateUrlDto): Promise<{
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            short_url: string;
            origin_url: string;
            expiration_date: Date;
        };
    }>;
    getOriginUrl(shortUrl: string, response: Response): Promise<void>;
}
