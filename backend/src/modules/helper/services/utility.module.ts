import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { ConvertToEnum } from './convert-to-enum.service';
import { UpdateService } from './update.service';

@Module({
  exports: [SearchService, ConvertToEnum, UpdateService],
  providers: [SearchService, ConvertToEnum, UpdateService],
})
export class UtilityModule {}
