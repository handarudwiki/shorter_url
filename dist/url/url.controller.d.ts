import { Response } from 'express';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create_url.dto';
export declare class UrlController {
    private readonly urlService;
    constructor(urlService: UrlService);
    createShortUrl(urlDto: CreateUrlDto): Promise<{
        id: string;
        origin_url: string;
        short_url: string;
        expiration_date: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getOriginUrl(shortUrl: string, response: Response): Promise<void>;
}
