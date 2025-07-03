import {
  Category,
  CategoryMapping,
  CategoryMappingRepository,
} from '@category';
import { Injectable, Logger } from '@nestjs/common';
import { Product } from '@product';

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
}
