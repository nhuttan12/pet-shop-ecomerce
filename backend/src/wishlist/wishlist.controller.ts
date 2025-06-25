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
import { Role } from '@role';
import {
  CreateWishlistDto,
  RemoveWishlistDto,
  WishlistResponseDto,
  WishlistService,
} from '@wishlist';

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
    @GetUser() userId: JwtPayload,
    @Body() { productId }: CreateWishlistDto,
  ): Promise<ApiResponse<WishlistResponseDto>> {
    const wishlists = await this.wishlistService.createWishList(
      userId.sub,
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
    @GetUser() userId: JwtPayload,
  ): Promise<ApiResponse<WishlistResponseDto>> {
    const wishtlist = await this.wishlistService.removeWishList(
      wishlistId,
      userId.sub,
    );
    this.logger.debug(`Remove wishlist: ${JSON.stringify(wishtlist)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.REMOVE_WISHLIST_SUCCESSFUL,
      data: wishtlist,
    };
  }
}
