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
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Brand } from 'src/db/helper/schema-type';
import { HasRole } from 'src/helper/decorator/roles.decorator';
import { BrandCreateDTO } from 'src/helper/dto/brand/create-brand.dto';
import { FindBrandByName } from 'src/helper/dto/brand/find-brand-by-name.dto';
import { GetAllBrandsDTO } from 'src/helper/dto/brand/get-all-brand.dto';
import { BrandUpdateDTO } from 'src/helper/dto/brand/update-brand.dto';
import { Role } from 'src/helper/enum/role.enum';
import { CatchEverythingFilter } from 'src/helper/filter/exception.filter';
import { JwtAuthGuard } from 'src/helper/guard/jwt-auth.guard';
import { RolesGuard } from 'src/helper/guard/roles.guard';
import { BrandService } from './brand.service';
import { ApiResponse } from 'src/helper/dto/response/ApiResponse/ApiResponse';
import { NotifyMessage } from 'src/helper/message/notify-message';
import { FindBrandById } from 'src/helper/dto/brand/find-brand-by-id.dto';

@ApiTags('Brand')
@Controller('brand')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@UseFilters(CatchEverythingFilter)
@Controller('brand')
export class BrandController {
  private readonly logger = new Logger();
  constructor(private brandSerivce: BrandService) {}

  @Post('adding')
  @HasRole(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @ApiBody({ type: BrandCreateDTO })
  @ApiOkResponse({ type: ApiResponse })
  async addingNewBrand(
    @Body() brand: BrandCreateDTO,
  ): Promise<ApiResponse<Brand>> {
    const newBrand: Brand = await this.brandSerivce.insertBrand(brand);
    this.logger.debug(
      `Get brand after insert in controller ${JSON.stringify(newBrand)}`,
    );

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_BRAND_SUCCESSFUL,
      data: newBrand,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiOkResponse({ type: ApiResponse })
  async getAllBrand(
    @Query() brand: GetAllBrandsDTO,
  ): Promise<ApiResponse<Brand[]>> {
    const newBrand: Brand[] = await this.brandSerivce.getAllBrands(brand);
    this.logger.debug(`Get brand in controller ${JSON.stringify(newBrand)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_BRAND_SUCCESSFUL,
      data: newBrand,
    };
  }

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ApiResponse })
  @ApiParam({ name: 'id', type: Number, description: 'Brand ID' })
  @ApiOkResponse({ type: ApiResponse })
  async getBrandById(
    @Param() brand: FindBrandById,
  ): Promise<ApiResponse<Brand>> {
    const newBrand: Brand = await this.brandSerivce.getBrandsById(brand);
    this.logger.debug(`Get brand in controller ${JSON.stringify(newBrand)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_BRAND_SUCCESSFUL,
      data: newBrand,
    };
  }

  @Get('name/:name')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ApiResponse })
  @ApiParam({ name: 'name', type: String, description: 'Brand Name' })
  @ApiOkResponse({ type: ApiResponse })
  async findBrandByName(
    @Param() brand: FindBrandByName,
  ): Promise<ApiResponse<Brand[]>> {
    const brands = await this.brandSerivce.findBrandsByName(brand);
    this.logger.debug(`Brands by name":  ${JSON.stringify(brands)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_BRAND_SUCCESSFUL,
      data: brands,
    };
  }

  @Put('update')
  @HasRole(Role.ADMIN)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: BrandUpdateDTO })
  @ApiOkResponse({ type: ApiResponse })
  async updateBrand(
    @Body() brand: BrandUpdateDTO,
  ): Promise<ApiResponse<Brand>> {
    const updatedBrand: Brand = await this.brandSerivce.updateBrand(brand);
    this.logger.debug(`Updated brand: ${JSON.stringify(updatedBrand)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_BRAND_SUCCESSFUL,
      data: updatedBrand,
    };
  }
}
