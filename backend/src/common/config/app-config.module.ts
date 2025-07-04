import { AppConfigService } from '@common';
import { Module } from '@nestjs/common';

@Module({
  exports: [AppConfigService],
  providers: [AppConfigService],
})
export class AppConfigModule {}
