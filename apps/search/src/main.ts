import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SearchModule } from './search.module';

async function bootstrap() {
  process.title = 'search';
  const logger = new Logger('SearchBootstrap');
  const port = Number(process.env.SEARCH_TCP_PORT ?? 4012);

  const rmqpUrl = process.env.RABBITMQ_URL;
  const queue = process.env.MEDIA_QUEUE;

  if (!rmqpUrl) {
    throw new Error('RABBITMQ_URL is not defined');
  }

  if (!queue) {
    throw new Error('CATALOG_QUEUE is not defined');
  }

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SearchModule,
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

  logger.log(
    `Search microservice (RMQ) is listening on queue ${queue} via ${rmqpUrl}`,
  );
}
bootstrap();
