import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiResponse as ApiSwaggerResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from 'src/helper/dto/wishlist/create-wishlist.dto';
import { WishlistResponseDto } from 'src/helper/dto/wishlist/wishlist-response.dto';
import { GetUser } from 'src/helper/decorator/user.decorator';
import { RemoveWishlistDto } from 'src/helper/dto/wishlist/remove-wishlist.dto';
import { CatchEverythingFilter } from 'src/helper/filter/exception.filter';
import { JwtAuthGuard } from 'src/helper/guard/jwt-auth.guard';
import { RolesGuard } from 'src/helper/guard/roles.guard';
import { HasRole } from 'src/helper/decorator/roles.decorator';
import { Role } from 'src/helper/enum/role.enum';
import { ApiResponse } from 'src/helper/dto/response/ApiResponse/ApiResponse';
import { NotifyMessage } from 'src/helper/message/notify-message';

@Controller('wishlist')
@ApiTags('Wishlist')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard, RolesGuard)
@HasRole(Role.USER, Role.ADMIN)
@UseFilters(CatchEverythingFilter)
export class WishlistController {
  private readonly logger = new Logger(WishlistController.name);

  constructor(private readonly wishlistService: WishlistService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Thêm sản phẩm vào wishlist' })
  @ApiBody({ type: CreateWishlistDto })
  @ApiSwaggerResponse({
    status: HttpStatus.CREATED,
    description: 'Thêm vào wishlist thành công',
    type: WishlistResponseDto,
  })
  @ApiSwaggerResponse({
    status: HttpStatus.CONFLICT,
    description: 'Sản phẩm đã có trong wishlist',
  })
  async createWishlist(
    @GetUser() userId: number,
    @Body() { productId }: CreateWishlistDto,
  ): Promise<ApiResponse<WishlistResponseDto>> {
    const wishlists = await this.wishlistService.createWishList(
      userId,
      productId,
    );
    this.logger.debug(`Wishlist: ${JSON.stringify(wishlists)}`);

    return {
      statusCode: HttpStatus.CREATED,
      message: NotifyMessage.CREATE_WISHLIST_SUCCESSFUL,
      data: wishlists,
    };
  }

  @Delete('remove')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Xóa sản phẩm khỏi wishlist (soft delete)' })
  @ApiBody({ type: RemoveWishlistDto })
  @ApiSwaggerResponse({
    status: HttpStatus.OK,
    description: 'Xóa khỏi wishlist thành công',
    type: WishlistResponseDto,
  })
  @ApiSwaggerResponse({
    status: HttpStatus.CONFLICT,
    description: 'Wishlist không tồn tại',
  })
  async removeWishlist(
    @Body() { wishlistId }: RemoveWishlistDto,
    @GetUser() userId: number,
  ): Promise<ApiResponse<WishlistResponseDto>> {
    const wishtlist = await this.wishlistService.removeWishList(
      wishlistId,
      userId,
    );
    this.logger.debug(`Remove wishlist: ${JSON.stringify(wishtlist)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.REMOVE_WISHLIST_SUCCESSFUL,
      data: wishtlist,
    };
  }
}
