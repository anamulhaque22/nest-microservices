import { Logger } from '@nestjs/common';

import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MediaModule } from './media.module';

async function bootstrap() {
  process.title = 'media';
  const logger = new Logger('MediaBootstrap');

  const port = Number(process.env.MEDIA_TCP_PORT ?? 4013);

  const rmqpUrl = process.env.RABBITMQ_URL;
  const queue = process.env.MEDIA_QUEUE;

  if (!rmqpUrl) {
    throw new Error('RABBITMQ_URL is not defined');
  }

  if (!queue) {
    throw new Error('MEDIA_QUEUE is not defined');
  }
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MediaModule,
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

  logger.log(`Media microservice listening on queue ${queue} via ${rmqpUrl}`);
}
bootstrap();
