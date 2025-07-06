import { JwtPayload } from '@auth';
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
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse as ApiSwaggerResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RoleName } from '@role';
import {
  CreateWishlistDto,
  RemoveWishlistDto,
  Wishlist,
  WishListMappingService,
  WishlistNotifyMessage,
  WishlistResponseDto,
  WishlistService,
} from '@wishlist';

@Controller('wishlist')
@ApiTags('Wishlist')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard, RolesGuard)
@HasRole(RoleName.USER, RoleName.ADMIN)
@UseFilters(CatchEverythingFilter)
export class WishlistController {
  private readonly logger = new Logger(WishlistController.name);

  constructor(
    private readonly wishlistService: WishlistService,
    private readonly wishlistMappingService: WishListMappingService,
  ) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Thêm sản phẩm vào wishlist' })
  @ApiBody({ type: CreateWishlistDto })
  @ApiSwaggerResponse({
    status: HttpStatus.CREATED,
    description: 'Thêm vào wishlist thành công',
    type: Wishlist,
  })
  @ApiSwaggerResponse({
    status: HttpStatus.CONFLICT,
    description: 'Sản phẩm đã có trong wishlist',
  })
  async createWishlist(
    @GetUser() userId: JwtPayload,
    @Body() { productId }: CreateWishlistDto,
  ): Promise<ApiResponse<Wishlist>> {
    const wishlists = await this.wishlistService.createWishList(
      userId.sub,
      productId,
    );
    this.logger.debug(`Wishlist: ${JSON.stringify(wishlists)}`);

    return {
      statusCode: HttpStatus.CREATED,
      message: WishlistNotifyMessage.CREATE_WISHLIST_SUCCESSFUL,
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
    @Body() { wishlistID }: RemoveWishlistDto,
    @GetUser() userId: JwtPayload,
  ): Promise<ApiResponse<Wishlist>> {
    const wishlist: Wishlist = await this.wishlistMappingService.removeWishList(
      wishlistID,
      userId.sub,
    );
    this.logger.debug(`Remove wishlist result: ${JSON.stringify(wishlist)}`);

    return {
      statusCode: HttpStatus.OK,
      message: WishlistNotifyMessage.REMOVE_WISHLIST_SUCCESSFUL,
      data: wishlist,
    };
  }
}
