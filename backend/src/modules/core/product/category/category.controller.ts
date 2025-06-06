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
import { Category } from 'src/db/helper/schema-type';
import { HasRole } from 'src/helper/decorator/roles.decorator';
import { ApiResponse } from 'src/helper/dto/response/ApiResponse/ApiResponse';
import { Role } from 'src/helper/enum/role.enum';
import { CatchEverythingFilter } from 'src/helper/filter/exception.filter';
import { JwtAuthGuard } from 'src/helper/guard/jwt-auth.guard';
import { RolesGuard } from 'src/helper/guard/roles.guard';
import { CategoryService } from './category.service';
import { CategoryCreateDTO } from 'src/helper/dto/category/create-category.dto';
import { NotifyMessage } from 'src/helper/message/notify-message';
import { GetAllCategoryDTO } from 'src/helper/dto/category/get-all-category.dto';
import { FindCategoryById } from 'src/helper/dto/category/find-category-by-id.dto';
import { FindCategoryByName } from 'src/helper/dto/category/find-category-by-name.dto';
import { CategoryUpdateDTO } from 'src/helper/dto/category/update-category.dto';

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
      message: NotifyMessage.GET_BRAND_SUCCESSFUL,
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
