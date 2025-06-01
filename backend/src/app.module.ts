import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './modules/config/configuration';
import { AppConfigModule } from './modules/config/app-config.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { UsersModule } from './modules/user/user.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { CatchEverythingFilter } from './helper/filter/exception.filter';
import { ImageModule } from './modules/image/image.module';
import { RoleModule } from './modules/role/role.module';
import { ProductModule } from './modules/product/product.module';
import { MailModule } from './modules/mail/mail.module';
import { BrandModule } from './modules/brand/brand.module';
import { CategoryController } from './modules/category/category.controller';
import { CategoryModule } from './modules/category/category.module';
import { CartModule } from './modules/cart/cart.module';
import { CartDetailModule } from './modules/cart-detail/cart-detail.module';
import { OrderModule } from './modules/order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    AuthModule,
    AppConfigModule,
    DatabaseModule,
    UsersModule,
    RoleModule,
    ProductModule,
    ImageModule,
    MailModule,
    BrandModule,
    CategoryModule,
    CartModule,
    CartDetailModule,
    OrderModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        enableDebugMessages: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
    {
      provide: APP_FILTER,
      useClass: CatchEverythingFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
  controllers: [CategoryController],
})
export class AppModule {}
