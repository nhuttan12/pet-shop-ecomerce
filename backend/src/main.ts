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
import { CatchEverythingFilter } from '@filter/exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  /**
   * @description: config for logging globaL
   * @param color: show color of text for each level of log
   * @param logLevels: all level of logging
   * @param timestamp: time the log was wrote
   */
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      logger: new ConsoleLogger('App'),
    },
  );

  /**
   * @description Sets a global prefix for all API routes.
   * This is useful for API versioning and maintaining a clean URL structure.
   * For example, all endpoints will be prefixed with /api/v1.
   */
  app.setGlobalPrefix('api/v1');

  /**
   * @description Enables Helmet, a middleware that helps secure the app
   * by setting various HTTP headers. It protects against common web vulnerabilities
   * like cross-site scripting (XSS), clickjacking, and others.
   */
  app.use(helmet());

  /**
   * @description: config info for swagger
   */
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

  /**
   * @description: config for global filter exception
   */
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new CatchEverythingFilter(httpAdapterHost));

  /**
   * @description: get configuration information to run the server
   * @param configService: call config service file to get the information from yaml file
   * @param port: port to run the http server
   */
  const configService: ConfigService = app.get(ConfigService);
  const port: number = configService.get<number>('http.port') || 3000;
  const client_1_host: string =
    configService.get<string>('domain.client_1.host') || 'http://localhost';
  const client_1_port: number =
    configService.get<number>('domain.client_1.port') || 3001;

  /**
   * @description Enables Cross-Origin Resource Sharing (CORS) to allow requests
   * from the specified frontend client.
   * `credentials: true` is required if the frontend sends cookies or uses HTTP authentication.
   * Make sure the origin is correctly formatted as a full URL (e.g., http://localhost:4200).
   */
  app.enableCors({
    origin: [`${client_1_host.trim()}:${client_1_port}`],
    credentials: true,
  });

  /**
   * @description: global pipe
   * @param enableDebugMessages: turn on debug message
   * @param transform: transform data when get
   */
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
