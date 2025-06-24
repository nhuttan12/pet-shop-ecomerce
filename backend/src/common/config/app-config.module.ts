import { AppConfigService } from '@helper-modules/config/app-config.service';
import { Module } from '@nestjs/common';

@Module({
  exports: [AppConfigService],
  providers: [AppConfigService],
})
export class AppConfigModule {}
