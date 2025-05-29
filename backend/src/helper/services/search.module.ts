import { Module } from '@nestjs/common';
import { SearchService } from './search.service';

@Module({
  exports: [SearchService],
  providers: [SearchService],
})
export class SearchModule {}
