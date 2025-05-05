import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AppConfigModule } from './config/app-config.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { StatusModule } from './status/status.module';
import { RolesGuard } from './helper/guard/roles.guard';
import { ProductModule } from './product/product.module';
import { APP_FILTER } from '@nestjs/core';
import { CatchEverythingFilter } from './helper/filter/exception.filter';

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
    StatusModule,
    ProductModule,
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
  ],
})
export class AppModule {}
