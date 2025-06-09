import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config'; // Add this import


async function bootstrap() {
 const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);

  const redisUrl = configService.getOrThrow<string>('REDIS_URL');
  const { hostname: host, port } = new URL(redisUrl);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.REDIS,
    options: {
      host,
      port: Number(port),
    },
  });

  await app.listen();
}

bootstrap();