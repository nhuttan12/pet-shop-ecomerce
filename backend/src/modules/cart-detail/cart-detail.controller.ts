import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
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
  ApiTags,
} from '@nestjs/swagger';
import { CartDetail } from 'src/db/helper/schema-type';
import { HasRole } from 'src/helper/decorator/roles.decorator';
import { CreateCartDetailDto } from 'src/helper/dto/cart-detail/create-cart-detail.dto';
import { ApiResponse } from 'src/helper/dto/response/ApiResponse/ApiResponse';
import { Role } from 'src/helper/enum/role.enum';
import { CatchEverythingFilter } from 'src/helper/filter/exception.filter';
import { JwtAuthGuard } from 'src/helper/guard/jwt-auth.guard';
import { NotifyMessage } from 'src/helper/message/notify-message';
import { CartDetailService } from './cart-detail.service';
import { GetCartDetailByCartId } from 'src/helper/dto/cart-detail/get-cart-detail-by-cart-id';
import { RemoveCartDetailDTO } from 'src/helper/dto/cart-detail/remove-cart-detail.dto';
import { CartDetailResponse } from 'src/helper/dto/cart-detail/cart-detail-response.dto';

@Controller('cart-detail')
@ApiTags('cart-detail')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@UseFilters(CatchEverythingFilter)
export class CartDetailController {
  constructor(private readonly cartDetailService: CartDetailService) {}

  @Post('/create')
  @HasRole(Role.USER)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: CreateCartDetailDto })
  @ApiOkResponse({ type: ApiResponse<CartDetail> })
  async create(
    @Body() createCartDetailDto: CreateCartDetailDto,
  ): Promise<ApiResponse<CartDetail>> {
    const cartDetail =
      await this.cartDetailService.createCartDetail(createCartDetailDto);
    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.CREATE_CART_DETAIL_SUCCESSFUL,
      data: cartDetail,
    };
  }

  @Post('/get')
  @HasRole(Role.USER)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: GetCartDetailByCartId })
  @ApiOkResponse({ type: ApiResponse<CartDetailResponse[]> })
  async getCartDetailByCartId(
    @Query() { id, limit, page }: GetCartDetailByCartId,
  ): Promise<ApiResponse<CartDetailResponse[]>> {
    const cartDetail = await this.cartDetailService.getCartDetailByCartId(
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

  @Delete('/remove/:id')
  @HasRole(Role.USER)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: RemoveCartDetailDTO })
  @ApiOkResponse({ type: ApiResponse<CartDetail> })
  async removeCartByCartId(
    @Param() { cartId }: RemoveCartDetailDTO,
  ): Promise<ApiResponse<CartDetail>> {
    const cartDetail = await this.cartDetailService.remove(cartId);
    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.REMOVE_CART_DETAIL_SUCCESSFUL,
      data: cartDetail,
    };
  }
}
