import { CategoryService } from '@core-modules/product/category/category.service';
import { HasRole } from '@decorator/roles.decorator';
import { CategoryCreateDTO } from '@dtos/category/create-category.dto';
import { FindCategoryById } from '@dtos/category/find-category-by-id.dto';
import { FindCategoryByName } from '@dtos/category/find-category-by-name.dto';
import { GetAllCategoryDTO } from '@dtos/category/get-all-category.dto';
import { CategoryUpdateDTO } from '@dtos/category/update-category.dto';
import { ApiResponse } from '@dtos/response/ApiResponse/ApiResponse';
import { Role } from '@enum/role.enum';
import { CatchEverythingFilter } from '@filter/exception.filter';
import { JwtAuthGuard } from '@guard/jwt-auth.guard';
import { RolesGuard } from '@guard/roles.guard';
import { NotifyMessage } from '@message/notify-message';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Category } from '@schema-type';

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
  @HasRole(Role.ADMIN)
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
      message: NotifyMessage.GET_CATEGORY_SUCCESSFUL,
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
      message: NotifyMessage.GET_CATEGORY_SUCCESSFUL,
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
  ): Promise<ApiResponse<Category[]>> {
    const categories: Category[] =
      await this.categoryService.findCategoriesById(category);
    this.logger.debug(
      `Get category in controller ${JSON.stringify(categories)}`,
    );

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_BRAND_SUCCESSFUL,
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
      message: NotifyMessage.GET_BRAND_SUCCESSFUL,
      data: newCategory,
    };
  }

  @Put('update')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @HasRole(Role.ADMIN)
  @ApiOperation({ summary: 'Cập nhật danh mục (chỉ ADMIN)' })
  @ApiBody({ type: CategoryUpdateDTO })
  @ApiOkResponse({
    type: ApiResponse,
    description: 'Cập nhật danh mục thành công',
  })
  async updateBrand(
    @Body() category: CategoryUpdateDTO,
  ): Promise<ApiResponse<Category>> {
    const updatedCategory: Category =
      await this.categoryService.updateCategory(category);
    this.logger.debug(
      `Get category after update in controller ${JSON.stringify(updatedCategory)}`,
    );

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.UPDATE_CATEGORY_SUCCESSFUL,
      data: updatedCategory,
    };
  }
}
