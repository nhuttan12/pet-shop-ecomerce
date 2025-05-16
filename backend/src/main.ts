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
import { CatchEverythingFilter } from './helper/filter/exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

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
