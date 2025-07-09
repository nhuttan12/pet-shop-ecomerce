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
  ApiOperation,
  ApiResponse as ApiOkResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { BrandUpdateDTO } from './dto/update-brand.dto';
import { ApiResponse } from '@api-response/ApiResponse';
import { Brand } from './entities/brands.entity';
import { BrandNotifyMessages } from './messages/brand.notify-message';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RoleName } from '@role/enums/role.enum';
import { HasRole } from '@decorators/roles.decorator';
import { CatchEverythingFilter } from '@filters/exception.filter';
import { BrandService } from './brand.service';
import { RolesGuard } from '@guards/roles.guard';
import { BrandCreateDTO } from './dto/create-brand.dto';
import { FindBrandById } from '@brand/dto/find-brand-by-id.dto';
import { FindBrandByName } from '@brand/dto/find-brand-by-name.dto';
import { GetAllBrandsDTO } from '@brand/dto/get-all-brand.dto';

@ApiTags('Brand')
@Controller('brand')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@UseFilters(CatchEverythingFilter)
export class BrandController {
  private readonly logger = new Logger(BrandController.name);

  constructor(private brandSerivce: BrandService) {}

  @Post('adding')
  @HasRole(RoleName.ADMIN)
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Thêm mới thương hiệu (chỉ ADMIN)' })
  @ApiBody({ type: BrandCreateDTO })
  @ApiOkResponse({
    type: ApiResponse,
    description: 'Thêm thương hiệu thành công',
  })
  async addingNewBrand(
    @Body() brand: BrandCreateDTO,
  ): Promise<ApiResponse<Brand>> {
    const newBrand: Brand = await this.brandSerivce.insertBrand(brand);
    this.logger.debug(
      `Get brand after insert in controller ${JSON.stringify(newBrand)}`,
    );

    return {
      statusCode: HttpStatus.OK,
      message: BrandNotifyMessages.BRAND_INSERT_SUCCESSFUL,
      data: newBrand,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy tất cả thương hiệu (phân trang, sắp xếp)' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Số lượng mỗi trang',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Vị trí bắt đầu',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Kiểu sắp xếp (tên cột)',
  })
  @ApiOkResponse({
    type: ApiResponse,
    description: 'Lấy danh sách thương hiệu thành công',
  })
  async getAllBrand(
    @Query() brand: GetAllBrandsDTO,
  ): Promise<ApiResponse<Brand[]>> {
    const newBrand: Brand[] = await this.brandSerivce.getAllBrands(brand);
    this.logger.debug(`Get brand in controller ${JSON.stringify(newBrand)}`);

    return {
      statusCode: HttpStatus.OK,
      message: BrandNotifyMessages.GET_BRAND_SUCCESSFUL,
      data: newBrand,
    };
  }

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy thương hiệu theo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Brand ID' })
  @ApiOkResponse({
    type: ApiResponse,
    description: 'Lấy thương hiệu theo ID thành công',
  })
  async getBrandById(
    @Param() brand: FindBrandById,
  ): Promise<ApiResponse<Brand>> {
    const newBrand: Brand = await this.brandSerivce.getBrandById(brand);
    this.logger.debug(`Get brand in controller ${JSON.stringify(newBrand)}`);

    return {
      statusCode: HttpStatus.OK,
      message: BrandNotifyMessages.GET_BRAND_SUCCESSFUL,
      data: newBrand,
    };
  }

  @Get('name/:name')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Tìm kiếm thương hiệu theo tên' })
  @ApiParam({ name: 'name', type: String, description: 'Brand Name' })
  @ApiOkResponse({
    type: ApiResponse,
    description: 'Tìm kiếm thương hiệu thành công',
  })
  async findBrandByName(
    @Param() brand: FindBrandByName,
  ): Promise<ApiResponse<Brand[]>> {
    const brands = await this.brandSerivce.findBrandsByName(brand);
    this.logger.debug(`Brands by name":  ${JSON.stringify(brands)}`);

    return {
      statusCode: HttpStatus.OK,
      message: BrandNotifyMessages.GET_BRAND_SUCCESSFUL,
      data: brands,
    };
  }

  @Put('update')
  @HasRole(RoleName.ADMIN)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cập nhật thương hiệu (chỉ ADMIN)' })
  @ApiBody({ type: BrandUpdateDTO })
  @ApiOkResponse({
    type: ApiResponse,
    description: 'Cập nhật thương hiệu thành công',
  })
  async updateBrand(
    @Body() brand: BrandUpdateDTO,
  ): Promise<ApiResponse<Brand>> {
    const updatedBrand: Brand = await this.brandSerivce.updateBrand(brand);
    this.logger.debug(`Updated brand: ${JSON.stringify(updatedBrand)}`);

    return {
      statusCode: HttpStatus.OK,
      message: BrandNotifyMessages.GET_BRAND_SUCCESSFUL,
      data: updatedBrand,
    };
  }
}
