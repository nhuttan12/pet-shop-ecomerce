import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { ImageModule } from '../image/image.module';
import { UtilityModule } from 'src/helper/services/utility.module';

@Module({
  imports: [ImageModule, UtilityModule],
  providers: [CategoryService],
  exports: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
