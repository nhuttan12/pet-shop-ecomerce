import { JwtPayload } from '@auth';
import {
  Cart,
  CartCreateDTO,
  CartDetail,
  CartDetailResponse,
  CartDetailService,
  CartService,
  GetCartDetailByCartId,
  RemoveCartDetailDTO,
} from '@cart';
import {
  ApiResponse,
  CatchEverythingFilter,
  GetUser,
  HasRole,
  JwtAuthGuard,
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
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { RoleName } from '@role';
import { CartNotifyMessage } from 'cart/messages/cart.notify-messages';

@ApiTags('Cart')
@ApiBearerAuth('jwt')
@UseFilters(CatchEverythingFilter)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('carts')
export class CartController {
  private readonly logger = new Logger();
  constructor(
    private readonly cartService: CartService,
    private readonly cartDetailService: CartDetailService,
  ) {}

  @Post('add-to-cart')
  @HasRole(RoleName.USER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Thêm giỏ hàng mới' })
  @ApiOkResponse({
    type: ApiResponse,
    description: 'Thêm giỏ hàng thành công',
  })
  async addProductToCart(
    @Body() { productId, quantity }: CartCreateDTO,
    @GetUser() user: JwtPayload,
  ): Promise<ApiResponse<Cart>> {
    const newCart = await this.cartService.addToCart(
      user.sub,
      productId,
      quantity,
    );
    this.logger.debug(`Cart: ${JSON.stringify(newCart)}`);

    return {
      statusCode: HttpStatus.OK,
      message: CartNotifyMessage.GET_CART_SUCCESSFUL,
      data: newCart,
    };
  }

  @Get('/cart-detail')
  @HasRole(RoleName.USER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy chi tiết giỏ hàng (phân trang)' })
  @ApiQuery({
    name: 'id',
    required: true,
    type: Number,
    description: 'Order ID',
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
    type: ApiResponse<CartDetailResponse[]>,
    description: 'Lấy chi tiết giỏ hàng thành công',
  })
  async getCartDetailsByUserID(
    @Query() request: GetCartDetailByCartId,
    @GetUser() user: JwtPayload,
  ): Promise<ApiResponse<CartDetailResponse[]>> {
    const cartDetail = await this.cartService.getAllCartItemsByUserID(
      request,
      user.sub,
    );
    return {
      statusCode: HttpStatus.OK,
      message: CartNotifyMessage.GET_CART_DETAIL_SUCCESSFUL,
      data: cartDetail,
    };
  }

  @Delete('/cart-detail/:id')
  @HasRole(RoleName.USER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa chi tiết giỏ hàng theo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'OrderDetail ID' })
  @ApiOkResponse({
    type: ApiResponse<CartDetail>,
    description: 'Xóa chi tiết giỏ hàng thành công',
  })
  async removeCartDetailByCartIDAndProductID(
    @Param() request: RemoveCartDetailDTO,
  ): Promise<ApiResponse<CartDetail>> {
    const cartDetail = await this.cartDetailService.removeCartItem(request);
    return {
      statusCode: HttpStatus.OK,
      message: CartNotifyMessage.REMOVE_CART_DETAIL_SUCCESSFUL,
      data: cartDetail,
    };
  }
}
