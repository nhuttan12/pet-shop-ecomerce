import { AuthModule } from '@auth';
import { BrandModule } from '@brand';
import { CartModule } from '@cart';
import { CategoryModule } from '@category';
import { CommentModule } from '@comment';
import {
  AppConfigModule,
  CatchEverythingFilter,
  ImageModule,
  MailModule,
  PaypalController,
  PaypalModule,
} from '@common';
import { ContactModule } from '@contact';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from '@order';
import { PostModule } from '@post';
import { ProductModule } from '@product';
import { ProductRatingModule } from '@product-rating';
import { RoleModule } from '@role';
import { UsersModule } from '@user';
import { VoucherModule } from '@voucher';
import { WishlistModule } from '@wishlist';
import configuration from 'common/config/configuration';
import { typeOrmConfig } from 'common/database/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    AuthModule,
    AppConfigModule,
    UsersModule,
    RoleModule,
    ProductModule,
    ImageModule,
    MailModule,
    BrandModule,
    CategoryModule,
    CartModule,
    OrderModule,
    VoucherModule,
    CommentModule,
    PostModule,
    ContactModule,
    WishlistModule,
    ProductRatingModule,
    PaypalModule,
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
  controllers: [PaypalController],
})
export class AppModule {}
