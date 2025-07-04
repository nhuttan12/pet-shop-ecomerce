import { JwtPayload } from '@auth';
import {
  ApiResponse,
  CatchEverythingFilter,
  GetUser,
  HasRole,
  JwtAuthGuard,
  NotifyMessage,
  RolesGuard,
} from '@common';
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
import {
  CreateProductRequest,
  DeleteProductByProductIdRequestDto,
  GetAllProductResponseDto,
  GetAllProductsRequest,
  GetProductByNameRequest,
  GetProductDetailRequestDto,
  GetProductDetailResponseDto,
  Product,
  ProductFilterParams,
  ProductRatingService,
  ProductService,
  ToggleRatingProductRequestDTO,
  UpdateProductInforRequestDTO,
} from '@product';
import { RoleName } from '@role';

@ApiTags('Product')
@Controller('product')
@ApiBearerAuth('jwt')
@UseFilters(CatchEverythingFilter)
export class ProductController {
  private readonly logger = new Logger(ProductController.name);
  constructor(
    private readonly productService: ProductService,
    private readonly productRatingService: ProductRatingService,
  ) {}

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
  @HasRole(RoleName.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cập nhật thông tin sản phẩm (chỉ ADMIN)' })
  @ApiBody({ type: UpdateProductInforRequestDTO })
  @ApiOkResponse({
    type: ApiResponse<Product>,
    description: 'Cập nhật sản phẩm thành công',
  })
  async updateProductInfor(
    @Body() request: UpdateProductInforRequestDTO,
  ): Promise<ApiResponse<Product>> {
    const product = await this.productService.updateProductInfor(request);
    this.logger.debug(`Product: ${JSON.stringify(product)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.UPDATE_PRODUCT_SUCCESSFUL,
      data: product,
    };
  }

  @Delete()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(RoleName.ADMIN)
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
  @HasRole(RoleName.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Tạo mới sản phẩm (chỉ ADMIN)' })
  @ApiBody({ type: CreateProductRequest })
  @ApiOkResponse({
    type: ApiResponse<Product>,
    description: 'Tạo sản phẩm thành công',
  })
  async createProduct(
    @Body() request: CreateProductRequest,
  ): Promise<ApiResponse<Product>> {
    const product = await this.productService.createProduct(request);
    this.logger.debug(`Product: ${JSON.stringify(product)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.CREATE_PRODUCT_SUCCESSFUL,
      data: product,
    };
  }

  @Get('filter')
  @ApiOperation({ summary: 'Lọc danh sách sản phẩm' })
  @ApiOkResponse({
    status: 200,
    description: 'Lấy danh sách sản phẩm thành công',
    type: GetAllProductResponseDto,
    isArray: true,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(RoleName.ADMIN)
  @HttpCode(HttpStatus.OK)
  async getFilteredProducts(
    @Query() query: ProductFilterParams,
  ): Promise<ApiResponse<GetAllProductResponseDto[]>> {
    const products = await this.productService.filterProducts(query);
    this.logger.debug(`Product: ${JSON.stringify(products)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_PRODUCT_SUCCESSFUL,
      data: products,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Đánh giá hoặc gỡ đánh giá sản phẩm' })
  @ApiOkResponse({
    status: 200,
    description: 'Thành công cập nhật trạng thái đánh giá',
  })
  @ApiBody({
    type: ToggleRatingProductRequestDTO,
    description: 'Số sao đánh giá (1-5)',
  })
  @HttpCode(HttpStatus.OK)
  async toggleRating(
    @Body() request: ToggleRatingProductRequestDTO,
    @GetUser() user: JwtPayload,
  ): Promise<ApiResponse<string>> {
    const ratingNotify: string =
      await this.productRatingService.toggleRatingProduct(user.sub, request);
    this.logger.debug(`Toggle rating: ${ratingNotify}`);

    return {
      statusCode: HttpStatus.OK,
      message: ratingNotify,
    };
  }
}
