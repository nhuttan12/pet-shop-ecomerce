import { CategoryController } from '@core-modules/product/category/category.controller';
import { CategoryService } from '@core-modules/product/category/category.service';
import { ImageModule } from '@helper-modules/image/image.module';
import { UtilityModule } from '@helper-modules/services/utility.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [ImageModule, UtilityModule],
  providers: [CategoryService],
  exports: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
