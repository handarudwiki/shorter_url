import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { Response } from 'express';

describe('UrlController', () => {
  let controller: UrlController;
  let urlService: UrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: UrlService,
          useValue: {
            createShortUrl: jest.fn(),
            getOriginUrl: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UrlController>(UrlController);
    urlService = module.get<UrlService>(UrlService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createShortUrl', () => {
    it('should call urlService.createShortUrl', async () => {
      const createUrlDto = {
        original_url: 'https://www.google.com',
      };

      const expectedResult = {
        data: {
          id: 'url-id',
          shortUrl: 'short-url',
          originUrl: createUrlDto.original_url,
        },
      };

      (urlService.createShortUrl as jest.Mock).mockResolvedValue(
        expectedResult,
      );

      const result = await controller.createShortUrl(createUrlDto);
      expect(result).toEqual(expectedResult);
      expect(urlService.createShortUrl).toHaveBeenCalledWith(createUrlDto);
    });
  });

  describe('getOriginalUrl', () => {
    it('should call urlService.getOriginUrl and redirect', async () => {
      const shortUrl = 'short-url';
      const originUrl = 'https://www.example.com';

      const response = {
        redirect: jest.fn(),
      } as unknown as Response;

      (urlService.getOriginUrl as jest.Mock).mockResolvedValue(originUrl);

      await controller.getOriginUrl(shortUrl, response);

      expect(urlService.getOriginUrl).toHaveBeenCalledWith(shortUrl);

      expect(response.redirect).toHaveBeenCalledWith(originUrl);
    });
  });
});
