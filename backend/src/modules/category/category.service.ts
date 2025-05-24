import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';
import { MySql2Database, MySqlRawQueryResult } from 'drizzle-orm/mysql2';
import { Category, CategoryInsert, Image } from 'src/db/helper/schema-type';
import { categories } from 'src/db/schema';
import { CategoryCreateDTO } from 'src/helper/dto/category/create-category.dto';
import { FindCategoryById } from 'src/helper/dto/category/find-category-by-id.dto';
import { FindCategoryByName } from 'src/helper/dto/category/find-category-by-name.dto';
import { GetAllCategoryDTO } from 'src/helper/dto/category/get-all-category.dto';
import { CategoryUpdateDTO } from 'src/helper/dto/category/update-category.dto';
import { CategoryStatus } from 'src/helper/enum/status/categories-status.enum';
import { ErrorMessage } from 'src/helper/message/error-message';
import { MessageLog } from 'src/helper/message/message-log';
import { DrizzleAsyncProvider } from 'src/modules/database/drizzle.provider';
import { ImageService } from './../image/image.service';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger();
  constructor(
    @Inject(DrizzleAsyncProvider)
    private categoryInsert: MySql2Database<CategoryInsert>,
    @Inject(DrizzleAsyncProvider)
    private categorySelect: MySql2Database<Category>,
    private imageService: ImageService,
  ) {}

  async getAllBrands(category: GetAllCategoryDTO): Promise<Category[]> {
    this.logger.debug(
      `Limit and offset for pagination ${category.limit}, ${category.page}`,
    );

    let offset: number = category.page;
    const limit: number = category.limit;

    offset = offset < 0 ? (offset = 0) : offset - 1;

    const categoryList: Category[] = await this.categorySelect
      .select()
      .from(categories)
      .orderBy(asc(categories.id))
      .limit(limit)
      .offset(offset);

    this.logger.debug(`Category list ${JSON.stringify(categoryList)}`);

    return categoryList;
  }

  async findCategoriesById(category: FindCategoryById): Promise<Category[]> {
    this.logger.debug('Id to get category', category.id);

    const categoryList: Category[] = await this.categorySelect
      .select()
      .from(categories)
      .where(eq(categories.id, categories.id))
      .orderBy(asc(categories.id));

    this.logger.debug(`Uset getted by id: ${JSON.stringify(categoryList)}`);

    return categoryList;
  }

  async findCategoriesByName(
    category: FindCategoryByName,
  ): Promise<Category[]> {
    this.logger.debug(`Name to find category: ${category.name}`);

    const categoryList: Category[] | undefined = await this.categorySelect
      .select()
      .from(categories)
      .where(eq(categories.name, categories.name))
      .limit(1)
      .execute();

    this.logger.debug(`User finded by name ${JSON.stringify(categoryList)}`);

    return categoryList;
  }

  async insertCategory(category: CategoryCreateDTO): Promise<Category> {
    try {
      const image: Image = await this.imageService.saveImage(
        category.savedImageDTO,
      );

      this.logger.debug(`Category: ${JSON.stringify(category)}`);

      const value: CategoryInsert = {
        name: category.name,
        status: CategoryStatus.ACTIVE,
        imageId: image.id,
        created_at: new Date(),
        updated_at: new Date(),
      };
      this.logger.debug(`Value ${JSON.stringify(value)}`);

      const [categoryCreatedId]: { id: number }[] =
        await this.categoryInsert.transaction(async (tx) => {
          return await tx.insert(categories).values(value).$returningId();
        });

      this.logger.debug(`Category created id ${categoryCreatedId.id}`);

      if (!categoryCreatedId) {
        this.logger.error(MessageLog.CATEGORY_NOT_FOUND);
        throw new InternalServerErrorException(
          ErrorMessage.INTERNAL_SERVER_ERROR,
        );
      }

      const [newCategory]: Category[] = await this.categorySelect
        .select()
        .from(categories)
        .where(eq(categories.id, categoryCreatedId.id));
      this.logger.debug(
        `Get new category from db ${JSON.stringify(newCategory)}`,
      );

      return newCategory;
    } catch (error) {
      this.logger.error(`Error: ${error}`);
      throw error;
    } finally {
      this.logger.verbose(`Adding category ${category.name} successfully`);
    }
  }

  async updateCategory(category: CategoryUpdateDTO): Promise<Category> {
    try {
      const image: Image = await this.imageService.saveImage(
        category.savedImageDTO,
      );
      const value: CategoryInsert = {
        name: category.name,
        status: category.status,
        imageId: image.id,
        updated_at: new Date(),
      };
      this.logger.debug(`Value to update ${JSON.stringify(value)}`);

      const categoryId: number = category.id;
      this.logger.debug(`Get category id ${categoryId}`);

      const result: MySqlRawQueryResult = await this.categoryInsert.transaction(
        async (tx) => {
          return await tx
            .update(categories)
            .set(value)
            .where(eq(categories.id, categoryId));
        },
      );
      this.logger.verbose(`Update result ${JSON.stringify(result)}`);

      if (!result) {
        this.logger.error(MessageLog.BRAND_CANNOT_BE_UPDATED);
        throw new InternalServerErrorException(
          ErrorMessage.INTERNAL_SERVER_ERROR,
        );
      }

      const [newCategory]: Category[] = await this.categorySelect
        .select()
        .from(categories)
        .where(eq(categories.id, category.id));
      this.logger.debug(
        `Get new category from db ${JSON.stringify(newCategory)}`,
      );

      return newCategory;
    } catch (error) {
      this.logger.error(`Error: ${error}`);
      throw error;
    } finally {
      this.logger.verbose(`Update category info ${category.id} successful`);
    }
  }
}
