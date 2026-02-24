import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CatalogModule } from './catalog.module';

async function bootstrap() {
  process.title = 'catalog';
  const logger = new Logger('CatalogBootstrap');
  const port = Number(process.env.CATALOP_TCP_PORT ?? 4011);

  const rmqpUrl = process.env.RABBITMQ_URL;
  const queue = process.env.CATALOG_QUEUE;

  if (!rmqpUrl) {
    throw new Error('RABBITMQ_URL is not defined');
  }

  if (!queue) {
    throw new Error('CATALOG_QUEUE is not defined');
  }

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CatalogModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rmqpUrl],
        queue,
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  app.enableShutdownHooks();
  await app.listen();

  logger.log(`Catalog RMQ listening on queue ${queue} via ${rmqpUrl}`);
}
bootstrap();
