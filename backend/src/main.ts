import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      logger: new ConsoleLogger({
        colors: true,
        logLevels: ['log', 'error', 'warn', 'debug', 'verbose'],
        timestamp: true,
      }),
    },
  );

  const configService: ConfigService = app.get(ConfigService);
  const port: number = configService.get<number>('http.port') || 3000;

  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: true,
      transform: true,
    }),
  );
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();
