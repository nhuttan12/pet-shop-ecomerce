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
import { FindBrandById } from './../../helper/dto/brand/find-brand-by-id.dto';
import { BrandService } from './brand.service';
import { ApiResponse } from 'src/helper/dto/response/ApiResponse/ApiResponse';
import { NotifyMessage } from 'src/helper/message/notify-message';

@Controller('brand')
export class BrandController {
  private readonly logger = new Logger();
  constructor(private brandSerivce: BrandService) {}

  @Post('adding')
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(Role.ADMIN)
  @UseFilters(CatchEverythingFilter)
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
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UseFilters(CatchEverythingFilter)
  @ApiOkResponse({ type: ApiResponse })
  @ApiBody({ type: GetAllBrandsDTO })
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

  @Get(':id')
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UseFilters(CatchEverythingFilter)
  @ApiOkResponse({ type: ApiResponse })
  @ApiParam({ name: 'id', type: Number, description: 'Brand id' })
  @ApiBody({ type: FindBrandById })
  async findUserById(
    @Param() brand: FindBrandById,
  ): Promise<ApiResponse<Brand[]>> {
    const newBrand: Brand[] = await this.brandSerivce.findBrandsById(brand);
    this.logger.debug(`Get brand in controller ${JSON.stringify(newBrand)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_BRAND_SUCCESSFUL,
      data: newBrand,
    };
  }

  @Get(':name')
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: ApiResponse })
  @ApiParam({ name: 'id', type: String, description: 'Brand name' })
  @UseFilters(CatchEverythingFilter)
  @ApiBody({ type: FindBrandByName })
  async findUserByName(
    @Param() brand: FindBrandByName,
  ): Promise<ApiResponse<Brand[]>> {
    const newBrand: Brand[] = await this.brandSerivce.findBrandsByName(brand);
    this.logger.debug(`Get brand in controller ${JSON.stringify(newBrand)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_BRAND_SUCCESSFUL,
      data: newBrand,
    };
  }

  @Put('update')
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(Role.ADMIN)
  @UseFilters(CatchEverythingFilter)
  @ApiOkResponse({ type: ApiResponse })
  @ApiBody({ type: BrandUpdateDTO })
  async updateBrand(
    @Body() brand: BrandUpdateDTO,
  ): Promise<ApiResponse<Brand>> {
    const newBrand: Brand = await this.brandSerivce.updateBrand(brand);
    this.logger.debug(
      `Get brand after insert in controller ${JSON.stringify(newBrand)}`,
    );

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_BRAND_SUCCESSFUL,
      data: newBrand,
    };
  }
}
