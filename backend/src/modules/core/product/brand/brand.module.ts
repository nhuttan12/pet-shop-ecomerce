import { BrandController } from '@core-modules/product/brand/brand.controller';
import { BrandService } from '@core-modules/product/brand/brand.service';
import { UtilityModule } from '@helper-modules/services/utility.module';
import { Module } from '@nestjs/common';

@Module({
  controllers: [BrandController],
  providers: [BrandService],
  imports: [UtilityModule],
})
export class BrandModule {}
