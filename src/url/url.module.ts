import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { PrismaService } from 'src/providers/prisma';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  providers: [UrlService, PrismaService],
  imports: [CacheModule.register()],
  controllers: [UrlController],
})
export class UrlModule {}
