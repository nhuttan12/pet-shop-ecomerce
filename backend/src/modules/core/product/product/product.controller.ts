import { ProductService } from '@core-modules/product/product/product.service';
import { HasRole } from '@decorator/roles.decorator';
import { CreateProductRequest } from '@dtos/product/create-product-request.dto';
import { DeleteProductByProductIdRequestDto } from '@dtos/product/delete-product-by-product-id-request.dto';
import { GetAllProductsRequest } from '@dtos/product/get-all-product-request.dto';
import { GetAllProductResponseDto } from '@dtos/product/get-all-product-response.dto';
import { GetProductByNameRequest } from '@dtos/product/get-product-by-name-request.dto';
import { GetProductDetailRequestDto } from '@dtos/product/get-product-detail-request.dto';
import { GetProductDetailResponseDto } from '@dtos/product/get-product-detail-response.dto';
import { UpdateProductInforRequestDTO } from '@dtos/product/update-product-infor-request.dto';
import { ApiResponse } from '@dtos/response/ApiResponse/ApiResponse';
import { Role } from '@enum/role.enum';
import { CatchEverythingFilter } from '@filter/exception.filter';
import { JwtAuthGuard } from '@guard/jwt-auth.guard';
import { RolesGuard } from '@guard/roles.guard';
import { NotifyMessage } from '@message/notify-message';
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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Product } from '@schema-type';

@ApiTags('Product')
@Controller('product')
@ApiBearerAuth('jwt')
@UseFilters(CatchEverythingFilter)
export class ProductController {
  private readonly logger = new Logger(ProductController.name);
  constructor(private productService: ProductService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm (phân trang)' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Số lượng mỗi trang',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Trang số',
  })
  @ApiOkResponse({
    type: ApiResponse<GetAllProductResponseDto[]>,
    description: 'Danh sách sản phẩm trả về thành công',
  })
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
  @ApiOperation({ summary: 'Tìm sản phẩm theo tên (phân trang)' })
  @ApiParam({ name: 'name', type: String, description: 'Tên sản phẩm' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Số lượng mỗi trang',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Trang số',
  })
  @ApiOkResponse({
    type: ApiResponse<GetAllProductResponseDto[]>,
    description: 'Kết quả tìm kiếm sản phẩm',
  })
  async findProductByName(
    @Param('name') name: string,
    @Query() { limit, page }: GetProductByNameRequest,
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
  @ApiOperation({ summary: 'Lấy chi tiết sản phẩm' })
  @ApiQuery({
    name: 'productId',
    required: true,
    type: Number,
    description: 'ID sản phẩm',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Số lượng mỗi trang',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Trang số',
  })
  @ApiOkResponse({
    type: ApiResponse<GetProductDetailResponseDto[]>,
    description: 'Chi tiết sản phẩm trả về thành công',
  })
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
  @ApiOperation({ summary: 'Cập nhật thông tin sản phẩm (chỉ ADMIN)' })
  @ApiBody({ type: UpdateProductInforRequestDTO })
  @ApiOkResponse({
    type: ApiResponse<Product>,
    description: 'Cập nhật sản phẩm thành công',
  })
  async updateProductInfor(
    @Body()
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
  @ApiOperation({ summary: 'Xóa sản phẩm (chỉ ADMIN)' })
  @ApiBody({ type: DeleteProductByProductIdRequestDto })
  @ApiOkResponse({
    type: ApiResponse<Product>,
    description: 'Xóa sản phẩm thành công',
  })
  async removeProductById(
    @Body() { productId }: DeleteProductByProductIdRequestDto,
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
  @ApiOperation({ summary: 'Tạo mới sản phẩm (chỉ ADMIN)' })
  @ApiBody({ type: CreateProductRequest })
  @ApiOkResponse({
    type: ApiResponse<Product>,
    description: 'Tạo sản phẩm thành công',
  })
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
