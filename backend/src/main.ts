import {
  BadRequestException,
  ConsoleLogger,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { CatchEverythingFilter } from '@filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      logger: new ConsoleLogger('App'),
    },
  );

  app.setGlobalPrefix('api/v1');
  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle('Thương mại điện tử')
    .setDescription('API test for Tmdt-ck')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter token',
      },
      'jwt',
    )
    .addTag('Tmdt-ck')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new CatchEverythingFilter(httpAdapterHost));

  const configService: ConfigService = app.get(ConfigService);
  const port: number = configService.get<number>('http.port') || 3000;

  // Enable CORS for the frontend origin (http://localhost:5173)
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Allow requests from Vite frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Include OPTIONS for preflight requests
    allowedHeaders: 'Content-Type, Authorization', // Allow JWT token and content type
    credentials: true, // Allow cookies or credentials if needed
  });

  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: true,
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((err) => ({
          field: err.property,
          errors: Object.values(err.constraints || {}),
        }));
        return new BadRequestException(formattedErrors);
      },
    }),
  );

  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();
