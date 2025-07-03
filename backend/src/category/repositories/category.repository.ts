import {
  Category,
  CategoryErrorMessages,
  CategoryMessagesLog,
  CategoryStatus,
  CategoryUpdateDTO,
} from '@category';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, InsertResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class CategoryRepository {
  private readonly logger = new Logger(CategoryRepository.name);
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    private readonly dataSource: DataSource,
  ) {}

  async getAllCategories(skip: number, take: number): Promise<Category[]> {
    return await this.categoryRepo.find({ skip, take });
  }

  async getCategoryById(id: number): Promise<Category | null> {
    return await this.categoryRepo.findOneBy({ id });
  }

  async findCategoryByName(
    name: string,
    skip: number,
    take: number,
  ): Promise<Category[]> {
    return await this.categoryRepo.find({ where: { name }, skip, take });
  }

  async insertCategory(name: string): Promise<Category> {
    return await this.dataSource.transaction(async (manager) => {
      const categoryInsert: InsertResult = await manager.insert(Category, {
        name,
        status: CategoryStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const categoryInsertIed: number = categoryInsert.identifiers[0]
        .id as number;

      if (!categoryInsertIed) {
        this.logger.error(CategoryMessagesLog.CATEGORY_CREATED_FAILED);
        throw new NotFoundException(
          CategoryErrorMessages.UPDATE_CATEGORY_FAILED,
        );
      }

      const newCategory: Category | null = await manager.findOneBy(Category, {
        id: categoryInsertIed,
      });

      if (!newCategory) {
        this.logger.error(
          CategoryMessagesLog.CATEGORY_CANNOT_BE_FOUND_AFTER_UPDATED,
        );
        throw new NotFoundException(
          CategoryErrorMessages.UPDATE_CATEGORY_FAILED,
        );
      }

      return newCategory;
    });
  }

  async updateCategory(category: CategoryUpdateDTO): Promise<boolean> {
    return await this.dataSource.transaction(async (manager) => {
      const updatedCategory: UpdateResult = await manager.update(
        Category,
        {
          id: category.id,
        },
        {
          name: category.name,
          status: category.status,
          updatedAt: new Date(),
        },
      );

      if (!updatedCategory.affected || updatedCategory.affected <= 0) {
        this.logger.error(CategoryMessagesLog.CATEGORY_UPDATED_FAILED);
        throw new NotFoundException(
          CategoryErrorMessages.UPDATE_CATEGORY_FAILED,
        );
      }

      return true;
    });
  }

  getCategoryByName(categoryName: string): Promise<Category | null> {
    return this.categoryRepo.findOneBy({ name: categoryName });
  }
}
