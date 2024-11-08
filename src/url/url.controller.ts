import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UrlService } from './url.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { CreateUrlDto } from './dto/create_url.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('url')
@ApiTags('URL Shortener')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createShortUrl(@Body() urlDto: CreateUrlDto) {
    return this.urlService.createShortUrl(urlDto);
  }

  @Get(':shortUrl')
  async getOriginUrl(
    @Param('shortUrl') shortUrl: string,
    @Res() response: Response,
  ) {
    const originUrl = await this.urlService.getOriginUrl(shortUrl);
    return response.redirect(originUrl);
  }
}
