import { Module } from '@nestjs/common';
import { SearchService } from '@helper-modules/services/search.service';
import { ConvertToEnum } from '@helper-modules/services/convert-to-enum.service';
import { UpdateService } from '@helper-modules/services/update.service';

@Module({
  exports: [SearchService, ConvertToEnum, UpdateService],
  providers: [SearchService, ConvertToEnum, UpdateService],
})
export class UtilityModule {}
