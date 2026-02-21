import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';

async function bootstrap() {
  process.title = 'gateway';
  const logger = new Logger('GatewayBootstrap');

  const app = await NestFactory.create(GatewayModule);
  app.enableShutdownHooks();

  const PORT = Number(process.env.GATEWAY_PORT ?? 3000);
  await app.listen(PORT);

  logger.log(`Gateway running at port ${PORT}`);
}
bootstrap();
