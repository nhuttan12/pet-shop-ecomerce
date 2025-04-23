import { Module } from '@nestjs/common';
import { AppConfigService } from './app-config.service';

@Module({
  exports: [AppConfigService],
  providers: [AppConfigService],
})
export class AppConfigModule {}
