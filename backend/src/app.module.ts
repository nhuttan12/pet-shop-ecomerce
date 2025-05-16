import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './modules/config/configuration';
import { AppConfigModule } from './modules/config/app-config.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { UsersModule } from './modules/user/user.module';
import { RolesGuard } from './helper/guard/roles.guard';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { CatchEverythingFilter } from './helper/filter/exception.filter';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { RoleModule } from './modules/role/role.module';
import { ProductModule } from './modules/product/product.module';
import { MailModule } from './modules/mail/mail.module';

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
    CloudinaryModule,
    MailModule,
  ],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
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
