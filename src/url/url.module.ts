import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { PrismaService } from 'src/providers/prisma';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  providers: [UrlService, PrismaService],
  imports: [
    CacheModule.register({
      ttl: 5,
      max: 100,
    }),
  ],
  controllers: [UrlController],
})
export class UrlModule {}
