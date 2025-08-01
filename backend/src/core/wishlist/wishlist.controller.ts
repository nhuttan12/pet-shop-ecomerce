import { JwtPayload } from '@auth/interfaces/jwt-payload.interface';
import { ApiResponse } from '@api-response/ApiResponse';
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
import { RoleName } from '@role/enums/role.enum';
import { CreateWishlistDto } from '@wishlist/dto/create-wishlist.dto';
import { RemoveWishlistDto } from '@wishlist/dto/remove-wishlist.dto';
import { WishlistMappingResponseDto } from '@wishlist/dto/wishlist-mapping-response.dto';
import { Wishlist } from '@wishlist/entities/wishlists.entity';
import { WishlistNotifyMessage } from '@wishlist/messages/wishlist.notify-messages';
import { WishListMappingService } from '@wishlist/wishlist-mapping.service';
import { WishlistService } from '@wishlist/wishlist.service';
import { PaginationResponse } from '@pagination/pagination-response';
import { UtilityService } from '@services/utility.service';
import { WishlistResponseDto } from '@wishlist/dto/wishlist-response.dto';

@Controller('wishlist')
@ApiTags('Wishlist')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard, RolesGuard)
@HasRole(RoleName.CUSTOMER, RoleName.ADMIN)
@UseFilters(CatchEverythingFilter)
export class WishlistController {
  private readonly logger = new Logger(WishlistController.name);

  constructor(
    private readonly utitly: UtilityService,
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
  ): Promise<ApiResponse<WishlistResponseDto>> {
    const wishlists = await this.wishlistService.createWishList(
      userId.sub,
      productId,
    );
    this.utitly.logPretty('Wishlist: ', wishlists);

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
    type: Wishlist,
  })
  @ApiSwaggerResponse({
    status: HttpStatus.CONFLICT,
    description: 'Wishlist không tồn tại',
  })
  async removeWishlist(
    @Body() { wishlistID }: RemoveWishlistDto,
    @GetUser() userId: JwtPayload,
  ): Promise<ApiResponse<WishlistResponseDto>> {
    const wishlist: WishlistResponseDto =
      await this.wishlistMappingService.removeWishList(wishlistID, userId.sub);

    this.utitly.logPretty('Remove wishlist result:', wishlist);

    return {
      statusCode: HttpStatus.OK,
      message: WishlistNotifyMessage.REMOVE_WISHLIST_SUCCESSFUL,
      data: wishlist,
    };
  }

  @Get('products')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy danh sách sản phẩm đã được thêm vào danh sách yêu thích',
  })
  @ApiSwaggerResponse({
    status: HttpStatus.OK,
    description:
      'Lấy danh sách sản phẩm đã được thêm vào danh sách yêu thích thành công',
    type: WishlistMappingResponseDto,
  })
  async getWishlistProducts(
    @GetUser() user: JwtPayload,
  ): Promise<ApiResponse<PaginationResponse<WishlistMappingResponseDto>>> {
    const wishlistMapping: PaginationResponse<WishlistMappingResponseDto> =
      await this.wishlistMappingService.getAllWishListMappingByUserID({
        userID: user.sub,
        page: 1,
        limit: 10,
      });
    this.utitly.logPretty('Get wishlist result:', wishlistMapping);

    return {
      statusCode: HttpStatus.OK,
      message: WishlistNotifyMessage.GET_WISHLIST_SUCCESSFUL,
      data: wishlistMapping,
    };
  }
}
