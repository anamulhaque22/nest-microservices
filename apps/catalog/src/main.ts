import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CatalogModule } from './catalog.module';

async function bootstrap() {
  process.title = 'catalog';
  const logger = new Logger('CatalogBootstrap');
  const port = Number(process.env.CATALOP_TCP_PORT ?? 4011);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CatalogModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: port,
      },
    },
  );

  app.enableShutdownHooks();
  await app.listen();

  logger.log(`Catalog microservices (TCP) listening on port ${port}`);
}
bootstrap();
