import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create_url.dto';
import { PrismaService } from 'src/providers/prisma';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { GoneException, NotFoundException } from '@nestjs/common';

describe('UrlService', () => {
  let urlService: UrlService;
  let prismaService: PrismaService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: PrismaService,
          useValue: {
            url: {
              create: jest.fn(),
              findUnique: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    urlService = module.get<UrlService>(UrlService);
    prismaService = module.get<PrismaService>(PrismaService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(urlService).toBeDefined();
  });

  describe('createShortUrl', () => {
    it('should create a short url', async () => {
      const createUrlDto: CreateUrlDto = {
        original_url: 'https://www.google.com',
      };

      const expectedResult = {
        id: 'url-id',
        shortUrl: 'short-url',
        originUrl: createUrlDto.original_url,
      };

      (prismaService.url.create as jest.Mock).mockResolvedValue(expectedResult);
      const result = await urlService.createShortUrl(createUrlDto);
      expect(result).toEqual({
        data: expectedResult,
      });
    });
  });

  it('should throw an error if short code already exist', async () => {
    const createUrlDto: CreateUrlDto = {
      original_url: 'https://www.google.com',
      custom_code: 'short-url',
    };

    (prismaService.url.findUnique as jest.Mock).mockResolvedValue({
      id: 'url-id',
      shortUrl: 'short-url',
      originUrl: createUrlDto.original_url,
    });

    await expect(urlService.createShortUrl(createUrlDto)).rejects.toThrow(
      'Short code already exist',
    );
  });

  describe('get original url', () => {
    it('should get origin url from cache', async () => {
      const shortUrl = 'short-url';
      const originUrl = 'https://www.google.com';

      (cacheManager.get as jest.Mock).mockResolvedValue(originUrl);

      const result = await urlService.getOriginUrl(shortUrl);
      expect(result).toEqual(originUrl);
    });

    it('should get origin url from database', async () => {
      const shortUrl = 'short-url';
      const originUrl = 'https://www.google.com';

      (cacheManager.get as jest.Mock).mockResolvedValue(null);
      (prismaService.url.findUnique as jest.Mock).mockResolvedValue({
        id: 'url-id',
        short_url: shortUrl,
        origin_url: originUrl,
      });

      const result = await urlService.getOriginUrl(shortUrl);
      expect(result).toEqual(originUrl);
    });

    it('should throw an error if url not found', async () => {
      const shortUrl = 'short-url';

      (cacheManager.get as jest.Mock).mockResolvedValue(null);
      (prismaService.url.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(urlService.getOriginUrl(shortUrl)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should delete URL if expired and throw GoneException', async () => {
      const shortUrl = 'short-url';

      (cacheManager.get as jest.Mock).mockResolvedValue(null);
      (prismaService.url.findUnique as jest.Mock).mockResolvedValue({
        id: 'url-id',
        short_url: shortUrl,
        origin_url: 'https://www.google.com',
        expiration_date: new Date('2021-01-01'),
      });
      (prismaService.url.delete as jest.Mock).mockResolvedValue(undefined);

      await expect(urlService.getOriginUrl(shortUrl)).rejects.toThrow(
        GoneException,
      );

      expect(prismaService.url.delete).toHaveBeenCalledWith({
        where: { short_url: shortUrl },
      });
    });
  });
});
