import {
  Category,
  CategoryController,
  CategoryMapping,
  CategoryService,
} from '@category';
import { ImageModule, UtilityModule } from '@common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryMappingService } from 'category/category-mapping.service';

@Module({
  imports: [
    ImageModule,
    UtilityModule,
    TypeOrmModule.forFeature([Category, CategoryMapping]),
  ],
  providers: [CategoryService, CategoryMappingService],
  exports: [CategoryService, CategoryMappingService],
  controllers: [CategoryController],
})
export class CategoryModule {}
