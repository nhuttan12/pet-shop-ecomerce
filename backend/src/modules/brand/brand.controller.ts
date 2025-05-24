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
    return await this.brandSerivce.insertBrand(brand);
  }

  @Get()
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UseFilters(CatchEverythingFilter)
  async getAllBrand(
    @Query() brand: GetAllBrandsDTO,
  ): Promise<ApiResponse<Brand[]>> {
    return await this.brandSerivce.getAllBrands(brand);
  }

  @Get(':id')
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UseFilters(CatchEverythingFilter)
  @ApiParam({ name: 'id', type: Number, description: 'User id' })
  async findUserById(
    @Param() brand: FindBrandById,
  ): Promise<ApiResponse<Brand[]>> {
    return this.brandSerivce.findBrandsById(brand);
  }

  @Get(':name')
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UseFilters(CatchEverythingFilter)
  async findUserByName(
    @Param() brand: FindBrandByName,
  ): Promise<ApiResponse<Brand[]>> {
    return this.brandSerivce.findBrandsByName(brand);
  }

  @Put('update')
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(Role.ADMIN)
  @UseFilters(CatchEverythingFilter)
  @ApiBody({ type: BrandUpdateDTO })
  async updateBrand(
    @Body() brand: BrandUpdateDTO,
  ): Promise<ApiResponse<Brand>> {
    return await this.brandSerivce.updateBrand(brand);
  }
}
