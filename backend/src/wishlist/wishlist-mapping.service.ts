import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UtilityService } from '@services/utility.service';
import { GetAllWishListMappingDTO } from '@wishlist/dto/get-all-wishlist-mapping-request.dto';
import { WishlistMapping } from '@wishlist/entities/wishlist-mapping.entity';
import { Wishlist } from '@wishlist/entities/wishlists.entity';
import { WishlistErrorMessage } from '@wishlist/messages/wishlist.error-messages';
import { WishlistMessageLog } from '@wishlist/messages/wishlist.message-logs';
import { WishlistMappingRepository } from '@wishlist/repositories/wishlist-mapping.repository';
import { WishlistService } from '@wishlist/wishlist.service';

@Injectable()
export class WishListMappingService {
  private readonly logger = new Logger(WishListMappingService.name);
  constructor(
    private readonly wishlistMappingRepo: WishlistMappingRepository,
    private readonly wishlistService: WishlistService,
    private readonly utilityService: UtilityService,
  ) {}

  async getAllWishListMappingByWishListId(request: GetAllWishListMappingDTO) {
    try {
      // 1. Get pagination information
      const { skip, take } = this.utilityService.getPagination(
        request.page,
        request.limit,
      );

      // 2. Get wishlist mapping list by wishlist id
      return await this.wishlistMappingRepo.getAllWishlistMappingByWishlistId(
        request.wishlistID,
        skip,
        take,
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async createWishlistMapping(
    wishlistID: number,
    productID: number,
  ): Promise<WishlistMapping> {
    return await this.wishlistMappingRepo.createWishlistMapping(
      wishlistID,
      productID,
    );
  }

  async removeWishList(productID: number, userID: number): Promise<Wishlist> {
    try {
      // 1. Get wishlist by user id
      const wishlist: Wishlist | null =
        await this.wishlistService.getWishtListByUserID(userID);

      // 2. Check wishlist exist
      if (!wishlist) {
        this.logger.warn(WishlistMessageLog.WISHLIST_NOT_FOUND);
        throw new NotFoundException(WishlistErrorMessage.WISHLIST_NOT_FOUND);
      }

      // 3. Remove wishlist mapping
      const result = await this.wishlistMappingRepo.removeWishlistMapping(
        userID,
        productID,
      );

      // 4. Check removing wishlist mapping result
      if (!result) {
        this.logger.error(WishlistErrorMessage.WISHLIST_NOT_FOUND);
        throw new ConflictException(WishlistErrorMessage.WISHLIST_NOT_FOUND);
      }

      // 5. Return wishlist and wishlist mapping
      return this.wishlistService.getWishlistAndWishlistMappingByUserID(userID);
    } catch (error) {
      this.logger.error(error);
      throw error;
    } finally {
      this.logger.log(`Update wishlist: ${productID} and user: ${userID}`);
    }
  }
}
