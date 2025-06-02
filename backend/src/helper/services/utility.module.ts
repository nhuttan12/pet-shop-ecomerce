import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { ConvertToEnum } from './convert-to-enum.service';

@Module({
  exports: [SearchService, ConvertToEnum],
  providers: [SearchService, ConvertToEnum],
})
export class UtilityModule {}
