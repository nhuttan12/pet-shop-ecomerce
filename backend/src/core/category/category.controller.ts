import { ApiResponse } from '@api-response/ApiResponse';
import { HasRole } from '@decorators/roles.decorator';
import { CatchEverythingFilter } from '@filters/exception.filter';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { RoleName } from '@role/enums/role.enum';
import { CategoryService } from './category.service';
import { CategoryCreateDTO } from './dto/create-category.dto';
import { FindCategoryById } from './dto/find-category-by-id.dto';
import { FindCategoryByName } from './dto/find-category-by-name.dto';
import { GetAllCategoryDTO } from './dto/get-all-category.dto';
import { GetCategoryByIdResponse } from './dto/get-category-by-id-response.dto';
import { CategoryUpdateDTO } from './dto/update-category.dto';
import { Category } from './entities/categories.entity';
import { CategoryNotifyMessages } from './messages/category.notify-messages';
import {
  Controller,
  UseFilters,
  UseGuards,
  Logger,
  HttpCode,
  HttpStatus,
  Body,
  Get,
  Query,
  Param,
  Put,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Category')
@Controller('category')
@ApiBearerAuth('jwt')
@UseFilters(CatchEverythingFilter)
@UseGuards(JwtAuthGuard)
export class CategoryController {
  private readonly logger = new Logger(CategoryController.name);
  constructor(private categoryService: CategoryService) {}

  @Post('adding')
  @UseGuards(RolesGuard)
  @HasRole(RoleName.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Thêm mới danh mục (chỉ ADMIN)' })
  @ApiBody({ type: CategoryCreateDTO })
  @ApiOkResponse({ type: ApiResponse, description: 'Thêm danh mục thành công' })
  async addingnewCategory(
    @Body() category: CategoryCreateDTO,
  ): Promise<ApiResponse<Category>> {
    const newCategory: Category =
      await this.categoryService.insertCategory(category);
    this.logger.debug(
      `Get category after insert in controller ${JSON.stringify(newCategory)}`,
    );

    return {
      statusCode: HttpStatus.OK,
      message: CategoryNotifyMessages.GET_CATEGORY_SUCCESSFUL,
      data: newCategory,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy tất cả danh mục (phân trang)' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Trang số',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Số lượng mỗi trang',
  })
  @ApiOkResponse({
    type: ApiResponse,
    description: 'Lấy danh sách danh mục thành công',
  })
  async getAllBrand(
    @Query() category: GetAllCategoryDTO,
  ): Promise<ApiResponse<Category[]>> {
    const categories: Category[] =
      await this.categoryService.getAllCategories(category);
    this.logger.debug(
      `Get category in controller ${JSON.stringify(categories)}`,
    );

    return {
      statusCode: HttpStatus.OK,
      message: CategoryNotifyMessages.GET_CATEGORY_SUCCESSFUL,
      data: categories,
    };
  }

  @Get('id/:id')
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy danh mục theo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Category ID' })
  @ApiOkResponse({
    type: ApiResponse,
    description: 'Lấy danh mục theo ID thành công',
  })
  async getCategoryById(
    @Param() category: FindCategoryById,
  ): Promise<ApiResponse<GetCategoryByIdResponse>> {
    const categories: GetCategoryByIdResponse =
      await this.categoryService.getCategoryWithImageById(category);
    this.logger.debug(
      `Get category in controller ${JSON.stringify(categories)}`,
    );

    return {
      statusCode: HttpStatus.OK,
      message: CategoryNotifyMessages.GET_CATEGORY_SUCCESSFUL,
      data: categories,
    };
  }

  @Get('name/:name')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Tìm kiếm danh mục theo tên' })
  @ApiParam({ name: 'name', type: String, description: 'Category name' })
  @ApiOkResponse({
    type: ApiResponse,
    description: 'Tìm kiếm danh mục theo tên thành công',
  })
  async findUserByName(
    @Param() category: FindCategoryByName,
  ): Promise<ApiResponse<Category[]>> {
    const newCategory: Category[] =
      await this.categoryService.findCategoriesByName(category);
    this.logger.debug(
      `Get category in controller ${JSON.stringify(newCategory)}`,
    );

    return {
      statusCode: HttpStatus.OK,
      message: CategoryNotifyMessages.GET_CATEGORY_SUCCESSFUL,
      data: newCategory,
    };
  }

  @Put('update')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @HasRole(RoleName.ADMIN)
  @ApiOperation({ summary: 'Cập nhật danh mục (chỉ ADMIN)' })
  @ApiBody({ type: CategoryUpdateDTO })
  @ApiOkResponse({
    type: ApiResponse,
    description: 'Cập nhật danh mục thành công',
  })
  async updateCategory(
    @Body() category: CategoryUpdateDTO,
  ): Promise<ApiResponse<GetCategoryByIdResponse>> {
    const response: GetCategoryByIdResponse =
      await this.categoryService.updateCategory(category);
    this.logger.debug(
      `Get category after update in controller ${JSON.stringify(response)}`,
    );

    return {
      statusCode: HttpStatus.OK,
      message: CategoryNotifyMessages.UPDATE_CATEGORY_SUCCESSFUL,
      data: response,
    };
  }
}
