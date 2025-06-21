import { Module } from '@nestjs/common';
import { SearchService } from '@helper-modules/services/search.service';
import { ConvertToEnum } from '@helper-modules/services/convert-to-enum.service';
import { UpdateService } from '@helper-modules/services/update.service';
import { UtilityService } from '@helper-modules/services/utility.service';

@Module({
  exports: [SearchService, ConvertToEnum, UpdateService, UtilityService],
  providers: [SearchService, ConvertToEnum, UpdateService, UtilityService],
})
export class UtilityModule {}
