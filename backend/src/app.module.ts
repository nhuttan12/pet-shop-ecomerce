import { AuthModule } from '@auth/auth.module';
import { BrandModule } from '@brand/brand.module';
import { CartModule } from '@cart/cart.module';
import { CategoryModule } from '@category/category.module';
import { CommentModule } from '@comment/comment.module';
import { AppConfigModule } from '@config/app-config.module';
import { ContactModule } from '@contact/contact.module';
import { CatchEverythingFilter } from '@filters/exception.filter';
import { ImageModule } from '@images/image.module';
import { MailModule } from '@mail/mail.module';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from '@order/order.module';
import { PaypalController } from '@paypal/paypal.controller';
import { PaypalModule } from '@paypal/paypal.module';
import { PostModule } from '@post/post.module';
import { ProductModule } from '@product/product.module';
import { RoleModule } from '@role/role.module';
import { UsersModule } from '@user/user.module';
import { VoucherModule } from '@voucher/voucher.module';
import { WishlistModule } from '@wishlist/wishlist.module';
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
    PaypalModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        // enableDebugMessages: true,
        // whitelist: true,
        // forbidNonWhitelisted: true,
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
