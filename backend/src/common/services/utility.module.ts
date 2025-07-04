import { UtilityService } from '@common';
import { Module } from '@nestjs/common';

@Module({
  exports: [UtilityService],
  providers: [UtilityService],
})
export class UtilityModule {}
