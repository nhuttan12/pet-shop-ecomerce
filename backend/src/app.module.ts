import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './modules/helper/config/configuration';
import { AppConfigModule } from './modules/helper/config/app-config.module';
import { DatabaseModule } from './modules/helper/database/database.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { CatchEverythingFilter } from './helper/filter/exception.filter';
import { ImageModule } from './modules/helper/image/image.module';
import { StripeModule } from './stripe/stripe.module';
import { AuthModule } from './modules/core/auth/auth.module';
import { UsersModule } from './modules/core/user/user.module';
import { RoleModule } from './modules/core/role/role.module';
import { ProductModule } from './modules/core/product/product/product.module';
import { MailModule } from './modules/helper/mail/mail.module';
import { BrandModule } from './modules/core/product/brand/brand.module';
import { CategoryModule } from './modules/core/product/category/category.module';
import { CartModule } from './modules/core/cart/cart.module';
import { OrderModule } from './modules/core/order/order.module';
import { VoucherModule } from './modules/core/product/voucher/voucher.module';
import { CommentModule } from './modules/core/forum/comment/comment.module';
import { PostModule } from './modules/core/forum/post/post.module';
import { ContactModule } from './modules/core/forum/contact/contact.module';
import { WishlistModule } from './modules/core/product/wishlist/wishlist.module';

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
