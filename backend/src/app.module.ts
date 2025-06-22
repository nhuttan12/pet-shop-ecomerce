import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '@helper-modules/config/configuration';
import { AppConfigModule } from '@helper-modules/config/app-config.module';
import { DatabaseModule } from '@helper-modules/database/database.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { CatchEverythingFilter } from '@filter/exception.filter';
import { ImageModule } from '@helper-modules/image/image.module';
import { StripeModule } from './stripe/stripe.module';
import { AuthModule } from '@core-modules/auth/auth.module';
import { UsersModule } from '@core-modules/user/user.module';
import { RoleModule } from '@core-modules/role/role.module';
import { ProductModule } from '@core-modules/product/product/product.module';
import { MailModule } from '@helper-modules/mail/mail.module';
import { BrandModule } from '@core-modules/product/brand/brand.module';
import { CategoryModule } from '@core-modules/product/category/category.module';
import { CartModule } from '@core-modules/cart/cart.module';
import { OrderModule } from '@core-modules/order/order.module';
import { VoucherModule } from '@core-modules/product/voucher/voucher.module';
import { CommentModule } from '@core-modules/forum/comment/comment.module';
import { PostModule } from '@core-modules/forum/post/post.module';
import { ContactModule } from '@core-modules/forum/contact/contact.module';
import { WishlistModule } from '@core-modules/product/wishlist/wishlist.module';
import { ProductRatingModule } from '@core-modules/product/product-rating/product-rating.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    StripeModule.forRootAsync(),
    // StripeModule,
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
    OrderModule,
    VoucherModule,
    CommentModule,
    PostModule,
    ContactModule,
    WishlistModule,
    ProductRatingModule,
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
})
export class AppModule {}
