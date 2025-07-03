import { Category, CategoryMapping } from '@category';
import { Injectable, Logger } from '@nestjs/common';
import { Product } from '@product';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CategoryMappingRepository {
  private readonly logger = new Logger(CategoryMappingRepository.name);
  constructor(
    private readonly categoryMappingRepo: Repository<CategoryMapping>,
    private readonly dataSource: DataSource,
  ) {}

  async createCategoryMapping(
    category: Category,
    product: Product,
  ): Promise<CategoryMapping> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const categoryMapping = manager.create(CategoryMapping, {
          category,
          product,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return await manager.save(categoryMapping);
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
