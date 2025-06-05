import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { UtilityModule } from 'src/modules/helper/services/utility.module';
import { ImageModule } from 'src/modules/helper/image/image.module';

@Module({
  imports: [ImageModule, UtilityModule],
  providers: [CategoryService],
  exports: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
