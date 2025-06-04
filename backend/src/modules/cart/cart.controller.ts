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
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Cart, CartDetail } from 'src/db/helper/schema-type';
import { HasRole } from 'src/helper/decorator/roles.decorator';
import { GetUser } from 'src/helper/decorator/user.decorator';
import { CartDetailResponse } from 'src/helper/dto/cart-detail/cart-detail-response.dto';
import { GetCartDetailByCartId } from 'src/helper/dto/cart-detail/get-cart-detail-by-cart-id';
import { RemoveCartDetailDTO } from 'src/helper/dto/cart-detail/remove-cart-detail.dto';
import { CartCreateDTO } from 'src/helper/dto/cart/create-cart.dto';
import { FindCartById } from 'src/helper/dto/cart/find-cart-by-id.dto';
import { GetAllCartsDTO } from 'src/helper/dto/cart/get-all-cart.dto';
import { RemoveCartDTO } from 'src/helper/dto/cart/remove-cart.dto';
import { ApiResponse } from 'src/helper/dto/response/ApiResponse/ApiResponse';
import { Role } from 'src/helper/enum/role.enum';
import { CatchEverythingFilter } from 'src/helper/filter/exception.filter';
import { JwtAuthGuard } from 'src/helper/guard/jwt-auth.guard';
import { RolesGuard } from 'src/helper/guard/roles.guard';
import { JwtPayload } from 'src/helper/interface/jwt-payload.interface';
import { NotifyMessage } from 'src/helper/message/notify-message';
import { main } from 'src/helper/services/seed';
import { CartService } from './cart.service';

@ApiTags('Cart')
@ApiBearerAuth('jwt')
@UseFilters(CatchEverythingFilter)
@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@Controller('carts')
export class CartController {
  private readonly logger = new Logger();
  constructor(private cartService: CartService) {}

  @Post('adding')
  @HasRole(Role.USER)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: CartCreateDTO })
  @ApiOkResponse({ type: ApiResponse })
  async addingnewCart(
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
      message: NotifyMessage.GET_CART_SUCCESSFUL,
      data: newCart,
    };
  }

  @Get()
  @HasRole(Role.USER)
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOkResponse({ type: ApiResponse })
  async getAllCart(
    @Query() cart: GetAllCartsDTO,
  ): Promise<ApiResponse<Cart[]>> {
    const carts = await this.cartService.getAllCarts(cart);
    this.logger.debug(`Cart: ${JSON.stringify(carts)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_CART_SUCCESSFUL,
      data: carts,
    };
  }

  @Get('id/:id')
  @HasRole(Role.USER)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: Number, description: 'Cart ID' })
  @ApiOkResponse({ type: ApiResponse })
  async getCartById(@Param() cart: FindCartById): Promise<ApiResponse<Cart>> {
    const carts = await this.cartService.getCartsById(cart.id);
    this.logger.debug(`Cart: ${JSON.stringify(carts)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_CART_SUCCESSFUL,
      data: carts,
    };
  }

  @Delete('cart/:id')
  @HasRole(Role.USER)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: RemoveCartDTO })
  @ApiOkResponse({ type: ApiResponse })
  async removeCart(@Param() cart: RemoveCartDTO): Promise<ApiResponse<Cart>> {
    const carts = await this.cartService.removeCart(cart);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_CART_SUCCESSFUL,
      data: carts,
    };
  }

  @Get('/cart-detail/get')
  @HasRole(Role.USER)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: GetCartDetailByCartId })
  @ApiOkResponse({ type: ApiResponse<CartDetailResponse[]> })
  async getCartDetailByCartId(
    @Query() { id, limit, page }: GetCartDetailByCartId,
  ): Promise<ApiResponse<CartDetailResponse[]>> {
    const cartDetail = await this.cartService.getCartDetailByCartId(
      id,
      limit,
      page,
    );
    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_CART_DETAIL_SUCCESSFUL,
      data: cartDetail,
    };
  }

  @Delete('/cart-detail/remove/:id')
  @HasRole(Role.USER)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: RemoveCartDetailDTO })
  @ApiOkResponse({ type: ApiResponse<CartDetail> })
  async removeCartByCartId(
    @Param() { cartId }: RemoveCartDetailDTO,
  ): Promise<ApiResponse<CartDetail>> {
    const cartDetail = await this.cartService.removeCartDetailById(cartId);
    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.REMOVE_CART_DETAIL_SUCCESSFUL,
      data: cartDetail,
    };
  }

  @Post('/seed')
  async seedData() {
    await main();
  }
}
