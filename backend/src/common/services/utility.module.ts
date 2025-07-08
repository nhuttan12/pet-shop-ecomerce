import { Module } from '@nestjs/common';
import { UtilityService } from '@services/utility.service';

@Module({
  exports: [UtilityService],
  providers: [UtilityService],
})
export class UtilityModule {}
