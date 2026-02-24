import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
