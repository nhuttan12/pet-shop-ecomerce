import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { SearchModule } from 'src/helper/services/utility.module';

@Module({
  controllers: [BrandController],
  providers: [BrandService],
  imports: [SearchModule],
})
export class BrandModule {}
