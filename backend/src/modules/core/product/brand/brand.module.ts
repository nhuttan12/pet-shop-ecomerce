import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { UtilityModule } from 'src/modules/helper/services/utility.module';

@Module({
  controllers: [BrandController],
  providers: [BrandService],
  imports: [UtilityModule],
})
export class BrandModule {}
