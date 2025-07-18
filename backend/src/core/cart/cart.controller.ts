import { ApiResponse } from '@api-response/ApiResponse';
import { JwtPayload } from '@auth/interfaces/jwt-payload.interface';
import { CartDetailService } from '@cart/cart-detail.service';
import { CartService } from '@cart/cart.service';
import { CartDetailResponse } from '@cart/dto/cart-detail/cart-detail-response.dto';
import { GetCartDetailByCartId } from '@cart/dto/cart-detail/get-cart-detail-by-cart-id';
import { RemoveCartDetailDTO } from '@cart/dto/cart-detail/remove-cart-detail.dto';
import { CartResponseDto } from '@cart/dto/cart/cart-response.dto';
import { CartCreateDTO } from '@cart/dto/cart/create-cart.dto';
import { CartDetail } from '@cart/entities/cart-details.entity';
import { CartNotifyMessage } from '@cart/messages/cart.notify-messages';
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
  ApiResponse as ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationResponse } from '@pagination/pagination-response';
import { RoleName } from '@role/enums/role.enum';
import { UtilityService } from '@services/utility.service';

@ApiTags('Cart')
@ApiBearerAuth('jwt')
@UseFilters(CatchEverythingFilter)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('carts')
export class CartController {
  private readonly logger = new Logger();
  constructor(
    private readonly utilityService: UtilityService,
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
  ): Promise<ApiResponse<CartResponseDto>> {
    const newCart: CartResponseDto = await this.cartService.addToCart(
      user.sub,
      productID,
      quantity,
    );
    this.utilityService.logPretty('Cart', newCart);

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
    type: ApiResponse<PaginationResponse<CartDetailResponse>>,
    description: 'Lấy chi tiết giỏ hàng thành công',
  })
  async getCartDetailsByUserID(
    @Query() request: GetCartDetailByCartId,
    @GetUser() user: JwtPayload,
  ): Promise<ApiResponse<PaginationResponse<CartDetailResponse>>> {
    // 1. Get cart details and meta pagination
    const cartDetail: PaginationResponse<CartDetailResponse> =
      await this.cartService.getAllCartItemsByUserID(request, user.sub);
    this.utilityService.logPretty('Cart detail list', cartDetail.data);
    this.utilityService.logPretty(
      'Cart detail meta pagination',
      cartDetail.meta,
    );

    // 2. Create response
    const response: ApiResponse<PaginationResponse<CartDetailResponse>> = {
      statusCode: HttpStatus.OK,
      message: CartNotifyMessage.GET_CART_DETAIL_SUCCESSFUL,
      data: cartDetail,
    };
    this.utilityService.logPretty('Response to client', response);

    // 3. Returning response
    return response;
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
