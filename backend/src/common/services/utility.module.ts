import { Module } from '@nestjs/common';
import { PrettyLoggerService } from '@services/pretty-logger.service';
import { UtilityService } from '@services/utility.service';

@Module({
  exports: [UtilityService],
  providers: [UtilityService, PrettyLoggerService],
})
export class UtilityModule {}
