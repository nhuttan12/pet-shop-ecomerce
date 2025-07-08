import { CategoryMapping } from '@category/entities/categories-mapping.entity';
import { Category } from '@category/entities/categories.entity';
import { CategoryMappingStatus } from '@category/enums/categories-mapping-status.enum';
import { CategoryMessagesLog } from '@category/messages/category.messages-log';
import { ErrorMessage } from '@messages/error.messages';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Product } from '@product/entites/products.entity';
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
          status: CategoryMappingStatus.ACTIVE,
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

  async removeCategoryMapping(id: number): Promise<boolean> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const result = await manager.update(
          CategoryMapping,
          { id },
          { status: CategoryMappingStatus.REMOVED, updatedAt: new Date() },
        );

        if (result.affected === 0) {
          this.logger.error(
            CategoryMessagesLog.CATEGORY_MAPPING_DELETED_FAILED,
          );
          throw new InternalServerErrorException(
            ErrorMessage.INTERNAL_SERVER_ERROR,
          );
        }

        return true;
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findCategoryMappingListWithProduct(
    product: Product,
  ): Promise<CategoryMapping[]> {
    try {
      // return await this.categoryMappingRepo.findBy({ product });
      return await this.categoryMappingRepo
        .createQueryBuilder('categoryMapping')
        .leftJoinAndSelect('categoryMapping.category', 'category')
        .orderBy('categoryMapping.id', 'ASC')
        .where('product.id = :id', { id: product.id })
        .getMany();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
