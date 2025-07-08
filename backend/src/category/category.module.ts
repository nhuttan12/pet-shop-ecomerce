import { CategoryController } from '@category/category.controller';
import { CategoryService } from '@category/category.service';
import { CategoryMapping } from '@category/entities/categories-mapping.entity';
import { Category } from '@category/entities/categories.entity';
import { CategoryMappingRepository } from '@category/repositories/category-mapping.repository';
import { CategoryRepository } from '@category/repositories/category.repository';
import { ImageModule } from '@images/image.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilityModule } from '@services/utility.module';
import { CategoryMappingService } from 'category/category-mapping.service';

@Module({
  imports: [
    ImageModule,
    UtilityModule,
    TypeOrmModule.forFeature([Category, CategoryMapping]),
  ],
  providers: [
    CategoryService,
    CategoryMappingService,
    CategoryRepository,
    CategoryMappingRepository,
  ],
  exports: [CategoryService, CategoryMappingService],
  controllers: [CategoryController],
})
export class CategoryModule {}
