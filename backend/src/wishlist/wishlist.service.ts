import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Wishlist } from '@wishlist/entities/wishlists.entity';
import { WishlistErrorMessage } from '@wishlist/messages/wishlist.error-messages';
import { WishlistMessageLog } from '@wishlist/messages/wishlist.message-logs';
import { WishlistRepository } from '@wishlist/repositories/wishlist.repository';
import { WishListMappingService } from '@wishlist/wishlist-mapping.service';

@Injectable()
export class WishlistService {
  private readonly logger = new Logger(WishlistService.name);
  constructor(
    private readonly wishlistRepo: WishlistRepository,
    private readonly wishlistMappingService: WishListMappingService,
  ) {}

  /**
   * Create wishlist (if not exist) and add product to it
   * @param userID - ID of user
   * @param productID - ID of product to add to wishlist
   * @returns The updated wishlist including the newly created wishlist mapping
   * @throws ConflictException if the product already exists in the wishlist
   * @throws InternalServerErrorException if creation fails
   */
  async createWishList(userID: number, productID: number): Promise<Wishlist> {
    try {
      // 1. Get wishlist
      let wishlist: Wishlist | null =
        await this.wishlistRepo.getWishtListByUserID(userID);
      this.logger.debug(`Wishlist: ${JSON.stringify(wishlist)}`);

      // 2. Check wishlist exist
      if (!wishlist) {
        wishlist = await this.wishlistRepo.createWishlist(userID);
      }

      // 3. Create wishlist mapping
      const wishlistMappingCreated =
        await this.wishlistMappingService.createWishlistMapping(
          wishlist.id,
          productID,
        );

      // 4. Check create wishlist result
      if (!wishlistMappingCreated) {
        this.logger.warn(WishlistMessageLog.WISHLIST_MAPPING_CREATED_FAILED);
        throw new ConflictException(
          WishlistErrorMessage.ADD_PRODUCT_TO_WISHLIST_FAILED,
        );
      }

      // 5. Return wishlist with wishlist mapping nesting
      return this.getWishlistAndWishlistMappingByUserID(userID);
    } catch (error) {
      this.logger.error(error);
      throw error;
    } finally {
      this.logger.debug(
        `Wishlist created with product id ${productID} and user id ${userID}`,
      );
    }
  }

  /**
   * Get wishlist and wishlist mapping by user id
   * @param userID - ID of user
   * @returns The wishlist and wishlist mapping
   * @throws NotFoundException if the wishlist is not found
   */
  async getWishlistAndWishlistMappingByUserID(
    userID: number,
  ): Promise<Wishlist> {
    // 1. Get wishlist
    const wishtlist: Wishlist | null =
      await this.wishlistRepo.getWishlistAndWishlistMappingByUserID(userID);

    // 2. Check wishlist exist
    if (!wishtlist) {
      this.logger.warn(WishlistMessageLog.WISHLIST_NOT_FOUND);
      throw new NotFoundException(WishlistErrorMessage.WISHLIST_NOT_FOUND);
    }

    return wishtlist;
  }

  async getWishtListByUserID(userID: number): Promise<Wishlist | null> {
    const wishlist: Wishlist | null =
      await this.wishlistRepo.getWishtListByUserID(userID);

    if (!wishlist) {
      this.logger.warn(WishlistMessageLog.WISHLIST_NOT_FOUND);
      throw new NotFoundException(WishlistErrorMessage.WISHLIST_NOT_FOUND);
    }

    return wishlist;
  }
}
