import { CategoryCreateDTO } from '@category/dto/create-category.dto';
import { FindCategoryById } from '@category/dto/find-category-by-id.dto';
import { FindCategoryByName } from '@category/dto/find-category-by-name.dto';
import { GetAllCategoryDTO } from '@category/dto/get-all-category.dto';
import { GetCategoryByIdResponse } from '@category/dto/get-category-by-id-response.dto';
import { CategoryUpdateDTO } from '@category/dto/update-category.dto';
import { Category } from '@category/entities/categories.entity';
import { CategoryErrorMessages } from '@category/messages/category.error-messages';
import { CategoryRepository } from '@category/repositories/category.repository';
import { SavedImageDTO } from '@images/dto/saved-image.dto';
import { Image } from '@images/entites/images.entity';
import { SubjectType } from '@images/enums/subject-type.enum';
import { ImageService } from '@images/image.service';
import { ErrorMessage } from '@messages/error.messages';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UtilityService } from '@services/utility.service';
import { CategoryMessagesLog } from '@category/messages/category.messages-log';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger();
  constructor(
    private utilityService: UtilityService,
    private categoryRepo: CategoryRepository,
    private imagesService: ImageService,
  ) {}

  async getAllCategories({
    limit,
    page,
  }: GetAllCategoryDTO): Promise<Category[]> {
    const { skip, take } = this.utilityService.getPagination(page, limit);
    this.logger.debug(`Pagination - skip: ${skip}, take: ${take}`);

    return await this.categoryRepo.getAllCategories(skip, take);
  }

  async getCategoryWithImageById(
    request: FindCategoryById,
  ): Promise<GetCategoryByIdResponse> {
    const category: Category | null = await this.categoryRepo.getCategoryById(
      request.id,
    );

    if (!category) {
      this.logger.error(CategoryMessagesLog.CATEGORY_NOT_FOUND);
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    }

    const categoryImage: Image =
      await this.imagesService.getImageBySubjectIdAndSubjectType(
        request.id,
        SubjectType.CATEGORY,
      );

    const merged = {
      ...category,
      imageUrl: categoryImage.url,
    };

    return plainToInstance(GetCategoryByIdResponse, merged, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  async findCategoriesByName({
    name,
    page,
    limit,
  }: FindCategoryByName): Promise<Category[]> {
    const { skip, take } = this.utilityService.getPagination(page, limit);

    this.logger.debug(`Pagination - skip: ${skip}, take: ${take}`);
    return await this.categoryRepo.findCategoryByName(name, skip, take);
  }

  async insertCategory(category: CategoryCreateDTO): Promise<Category> {
    try {
      this.logger.debug(`Category: ${JSON.stringify(category)}`);

      const categoryInseted: Category = await this.categoryRepo.insertCategory(
        category.name,
      );

      if (!categoryInseted) {
        this.logger.error(CategoryMessagesLog.CATEGORY_NOT_FOUND);
        throw new InternalServerErrorException(
          ErrorMessage.INTERNAL_SERVER_ERROR,
        );
      }

      await this.imagesService.saveImage(
        category.savedImageDTO,
        categoryInseted.id,
        SubjectType.CATEGORY,
      );

      return categoryInseted;
    } catch (error) {
      this.logger.error(`Error: ${error}`);
      throw error;
    } finally {
      this.logger.verbose(`Adding category ${category.name} successfully`);
    }
  }

  async updateCategory(
    category: CategoryUpdateDTO,
  ): Promise<GetCategoryByIdResponse> {
    try {
      // Check if category exists
      const existingCategory: Category | null =
        await this.categoryRepo.getCategoryById(category.id);

      if (!existingCategory) {
        this.logger.error(CategoryMessagesLog.CATEGORY_NOT_FOUND);
        throw new InternalServerErrorException(
          ErrorMessage.INTERNAL_SERVER_ERROR,
        );
      }

      const imageToSave: SavedImageDTO = category.savedImageDTO;

      // Update category image
      const image: Image = await this.imagesService.saveImage(
        imageToSave,
        category.id,
        SubjectType.CATEGORY,
      );

      if (!image) {
        this.logger.error(
          CategoryMessagesLog.CATEGORY_CANNOT_BE_FOUND_AFTER_CREATED,
        );
        throw new InternalServerErrorException(
          ErrorMessage.INTERNAL_SERVER_ERROR,
        );
      }

      // Check updating result
      const result: boolean = await this.categoryRepo.updateCategory(category);

      if (!result) {
        this.logger.warn(CategoryMessagesLog.CATEGORY_UPDATED_FAILED);
        throw new InternalServerErrorException(
          CategoryErrorMessages.UPDATE_CATEGORY_FAILED,
        );
      }

      const categoryAfterUpdate = await this.getCategoryWithImageById({
        id: category.id,
      });

      return categoryAfterUpdate;
    } catch (error) {
      this.logger.error(`Error: ${error}`);
      throw error;
    } finally {
      this.logger.verbose(`Update category info ${category.id} successful`);
    }
  }

  async getCategoryById(request: FindCategoryById): Promise<Category> {
    const category: Category | null = await this.categoryRepo.getCategoryById(
      request.id,
    );

    if (!category) {
      this.logger.error(CategoryMessagesLog.CATEGORY_NOT_FOUND);
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    }

    return category;
  }
}
