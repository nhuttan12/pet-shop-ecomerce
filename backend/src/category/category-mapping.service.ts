import { CategoryMapping } from '@category/entities/categories-mapping.entity';
import { Category } from '@category/entities/categories.entity';
import { CategoryMappingRepository } from '@category/repositories/category-mapping.repository';
import { Injectable, Logger } from '@nestjs/common';
import { Product } from '@product/entites/products.entity';

@Injectable()
export class CategoryMappingService {
  private readonly logger = new Logger(CategoryMappingService.name);
  constructor(
    private readonly categoryMappingRepo: CategoryMappingRepository,
  ) {}

  async createCategoryMapping(
    category: Category,
    product: Product,
  ): Promise<CategoryMapping> {
    return await this.categoryMappingRepo.createCategoryMapping(
      category,
      product,
    );
  }

  async removeCategoryMapping(id: number): Promise<boolean> {
    return await this.categoryMappingRepo.removeCategoryMapping(id);
  }

  async findCategoryMappingListWithProduct(
    product: Product,
  ): Promise<CategoryMapping[]> {
    const categoryMapping: CategoryMapping[] =
      await this.categoryMappingRepo.findCategoryMappingListWithProduct(
        product,
      );

    return categoryMapping;
  }
}
