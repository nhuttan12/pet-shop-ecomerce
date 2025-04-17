import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { AppConfigService } from './config/app-config.service';
import { DrizzleAsyncProvider } from './config/drizzle/drizzle.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
  exports: [ConfigModule, AppConfigService, DrizzleAsyncProvider],
})
export class AppModule {}
