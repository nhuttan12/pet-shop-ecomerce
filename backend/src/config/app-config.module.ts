import { Module } from '@nestjs/common';
import {
  DrizzleAsyncProvider,
  drizzleProvider,
} from './drizzle/drizzle.provider';
import { AppConfigService } from './app-config.service';

@Module({
  exports: [DrizzleAsyncProvider, AppConfigService],
  providers: [...drizzleProvider, AppConfigService],
})
export class AppConfigModule {}
