import { JwtPayload } from '@auth/interfaces/jwt-payload.interface';
import { ApiResponse } from '@api-response/ApiResponse';
import { CartDetailService } from '@cart/cart-detail.service';
import { CartService } from '@cart/cart.service';
import { CartDetailResponse } from '@cart/dto/cart-detail/cart-detail-response.dto';
import { GetCartDetailByCartId } from '@cart/dto/cart-detail/get-cart-detail-by-cart-id';
import { RemoveCartDetailDTO } from '@cart/dto/cart-detail/remove-cart-detail.dto';
import { CartCreateDTO } from '@cart/dto/cart/create-cart.dto';
import { CartDetail } from '@cart/entities/cart-details.entity';
import { Cart } from '@cart/entities/carts.entity';
import { HasRole } from '@decorators/roles.decorator';
import { GetUser } from '@decorators/user.decorator';
import { CatchEverythingFilter } from '@filters/exception.filter';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
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
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse as ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RoleName } from '@role/enums/role.enum';
import { CartNotifyMessage } from '@cart/messages/cart.notify-messages';

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
  @HasRole(RoleName.CUSTOMER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Thêm giỏ hàng mới' })
  @ApiOkResponse({
    type: ApiResponse,
    description: 'Thêm giỏ hàng thành công',
  })
  async addProductToCart(
    @Body() { productID, quantity }: CartCreateDTO,
    @GetUser() user: JwtPayload,
  ): Promise<ApiResponse<Cart>> {
    const newCart = await this.cartService.addToCart(
      user.sub,
      productID,
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
  @HasRole(RoleName.CUSTOMER)
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
  @HasRole(RoleName.CUSTOMER)
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
