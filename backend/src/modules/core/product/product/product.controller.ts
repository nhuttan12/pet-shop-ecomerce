import {
  Body,
  Controller,
  Delete,
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
import { GetAllProductResponseDto } from 'src/helper/dto/product/get-all-product-response.dto';
import { GetProductByNameRequest } from 'src/helper/dto/product/get-product-by-name-request.dto';
import { GetProductDetailResponseDto } from 'src/helper/dto/product/get-product-detail-response.dto';
import { ApiResponse } from 'src/helper/dto/response/ApiResponse/ApiResponse';
import { NotifyMessage } from 'src/helper/message/notify-message';
import { ProductService } from './product.service';
import { GetProductDetailRequestDto } from 'src/helper/dto/product/get-product-detail-request.dto';
import { Product } from 'src/db/helper/schema-type';
import { UpdateProductInforRequestDTO } from 'src/helper/dto/product/update-product-infor-request.dto';
import { CreateProductRequest } from 'src/helper/dto/product/create-product-request.dto';
import { DeleteProductByProductIdRequestDto } from 'src/helper/dto/product/delete-product-by-product-id-request.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CatchEverythingFilter } from 'src/helper/filter/exception.filter';
import { JwtAuthGuard } from 'src/helper/guard/jwt-auth.guard';
import { RolesGuard } from 'src/helper/guard/roles.guard';
import { HasRole } from 'src/helper/decorator/roles.decorator';
import { Role } from 'src/helper/enum/role.enum';
import { GetAllProductsRequest } from 'src/helper/dto/product/get-all-product-request.dto';

@Controller('product')
@ApiTags('Product')
@ApiBearerAuth('jwt')
@UseFilters(CatchEverythingFilter)
export class ProductController {
  private readonly logger = new Logger();
  constructor(private productService: ProductService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: GetAllProductsRequest })
  @ApiOkResponse({ type: ApiResponse<GetAllProductResponseDto[]> })
  async getAllProducts(
    @Query() { limit, page }: GetAllProductsRequest,
  ): Promise<ApiResponse<GetAllProductResponseDto[]>> {
    const product = await this.productService.getAllProducts(limit, page);
    this.logger.debug(`Product: ${JSON.stringify(product)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_PRODUCT_SUCCESSFUL,
      data: product,
    };
  }

  @Get('name/:name')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: GetProductByNameRequest })
  @ApiOkResponse({ type: ApiResponse<GetAllProductResponseDto[]> })
  async findProductByName(
    @Query() { limit, page, name }: GetProductByNameRequest,
  ): Promise<ApiResponse<GetAllProductResponseDto[]>> {
    const products = await this.productService.findProductByName(
      name,
      limit,
      page,
    );
    this.logger.debug(`Product: ${JSON.stringify(products)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_PRODUCT_SUCCESSFUL,
      data: products,
    };
  }

  @Get('detail')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: GetProductDetailRequestDto })
  @ApiOkResponse({ type: ApiResponse<GetProductDetailResponseDto[]> })
  async getProductDetail(
    @Query() { productId, limit, page }: GetProductDetailRequestDto,
  ): Promise<ApiResponse<GetProductDetailResponseDto>> {
    const products = await this.productService.getProductDetail(
      productId,
      page,
      limit,
    );
    this.logger.debug(`Product: ${JSON.stringify(products)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_PRODUCT_SUCCESSFUL,
      data: products,
    };
  }

  @Put('update')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: UpdateProductInforRequestDTO })
  @ApiOkResponse({ type: ApiResponse<Product> })
  async updateProductInfor(
    @Param()
    {
      id,
      name,
      brandName,
      categoryName,
      description,
      price,
      stock,
      status,
      mainImage,
      subImages,
    }: UpdateProductInforRequestDTO,
  ): Promise<ApiResponse<Product>> {
    const product = await this.productService.updateProductInfor({
      id,
      name,
      brandName,
      categoryName,
      description,
      price,
      stock,
      status,
      mainImage,
      subImages,
    });
    this.logger.debug(`Product: ${JSON.stringify(product)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.UPDATE_PRODUCT_SUCCESSFUL,
      data: product,
    };
  }

  @Delete()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: DeleteProductByProductIdRequestDto })
  @ApiOkResponse({ type: ApiResponse<Product> })
  async removeProductById(
    @Param() { productId }: DeleteProductByProductIdRequestDto,
  ): Promise<ApiResponse<Product>> {
    const product = await this.productService.removeProductById(productId);
    this.logger.debug(`Product: ${JSON.stringify(product)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.DELETE_PRODUCT_SUCCESSFUL,
      data: product,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: CreateProductRequest })
  @ApiOkResponse({ type: ApiResponse<Product> })
  async createProduct(
    @Body()
    {
      brandName,
      categoryName,
      description,
      discount,
      name,
      price,
      quantity,
      mainImage,
      subImages,
    }: CreateProductRequest,
  ): Promise<ApiResponse<Product>> {
    const product = await this.productService.createProduct({
      brandName,
      categoryName,
      description,
      discount,
      name,
      price,
      quantity,
      mainImage,
      subImages,
    });
    this.logger.debug(`Product: ${JSON.stringify(product)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.CREATE_PRODUCT_SUCCESSFUL,
      data: product,
    };
  }
}
