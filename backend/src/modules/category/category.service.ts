import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { eq, like } from 'drizzle-orm';
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
import { SearchService } from 'src/helper/services/search.service';
import { DrizzleAsyncProvider } from 'src/modules/database/drizzle.provider';
import { ImageService } from './../image/image.service';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger();
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: MySql2Database<any>,
    private imageService: ImageService,
    private searchService: SearchService,
  ) {}

  async getAllCategories({
    limit,
    page,
  }: GetAllCategoryDTO): Promise<Category[]> {
    const offset = Math.max(0, page - 1);
    this.logger.debug(`Pagination - limit: ${limit}, offset: ${offset}`);

    return await this.searchService.findManyOrReturnEmptyArray<Category, any>(
      this.db,
      categories,
      undefined,
      limit,
      offset,
    );
  }

  async findCategoriesById({ id }: FindCategoryById): Promise<Category[]> {
    return await this.searchService.findManyOrReturnEmptyArray<Category, any>(
      this.db,
      categories,
      eq(categories.id, id),
    );
  }

  async findCategoriesByName({
    name,
    page,
    limit,
  }: FindCategoryByName): Promise<Category[]> {
    const offset = Math.max(0, page - 1);
    this.logger.debug(`Pagination - limit: ${limit}, offset: ${offset}`);
    return await this.searchService.findManyOrReturnEmptyArray<Category, any>(
      this.db,
      categories,
      like(categories.name, `%${name}%`),
      limit,
      offset,
    );
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

      const [categoryCreatedId]: { id: number }[] = await this.db.transaction(
        (tx) => {
          return tx.insert(categories).values(value).$returningId();
        },
      );

      if (!categoryCreatedId) {
        this.logger.error(MessageLog.CATEGORY_NOT_FOUND);
        throw new InternalServerErrorException(
          ErrorMessage.INTERNAL_SERVER_ERROR,
        );
      }

      return await this.searchService.findOneOrThrow<Category>(
        this.db,
        categories,
        eq(categories.id, categoryCreatedId.id),
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
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

      const result: MySqlRawQueryResult = await this.db.transaction(
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

      return await this.searchService.findOneOrThrow<Category>(
        this.db,
        categories,
        eq(categories.id, category.id),
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    } catch (error) {
      this.logger.error(`Error: ${error}`);
      throw error;
    } finally {
      this.logger.verbose(`Update category info ${category.id} successful`);
    }
  }
}
