import { AppConfigService } from '@config/app-config.service';
import { Module } from '@nestjs/common';

@Module({
  exports: [AppConfigService],
  providers: [AppConfigService],
})
export class AppConfigModule {}
