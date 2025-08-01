import { CategoryMapping } from '@category/entities/categories-mapping.entity';
import { Category } from '@category/entities/categories.entity';
import { CategoryMappingRepository } from '@category/repositories/category-mapping.repository';
import { Injectable, Logger } from '@nestjs/common';
import { Product } from '@product/entites/products.entity';
import { UtilityService } from '@services/utility.service';

@Injectable()
export class CategoryMappingService {
  private readonly logger = new Logger(CategoryMappingService.name);
  constructor(
    private readonly utilityService: UtilityService,
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

  async findCategoryMappingListWithProductID(
    productID: number,
  ): Promise<CategoryMapping[]> {
    try {
      // 1. Get category mapping list with product
      const categoryMapping: CategoryMapping[] =
        await this.categoryMappingRepo.findCategoryMappingListWithProductID(
          productID,
        );
      this.utilityService.logPretty('Category mapping list: ', categoryMapping);

      return categoryMapping;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
