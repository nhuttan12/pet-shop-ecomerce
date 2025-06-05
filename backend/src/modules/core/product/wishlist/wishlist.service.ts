import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { Wishlist } from 'src/db/helper/schema-type';
import { wishlists } from 'src/db/schema';
import { WishlistStatus } from 'src/helper/enum/status/wishlist-status.enum';
import { WishlistErrorMessage } from 'src/helper/message/wishlist-message';
import { DrizzleAsyncProvider } from 'src/modules/helper/database/drizzle.provider';
import { SearchService } from 'src/modules/helper/services/search.service';

@Injectable()
export class WishlistService {
  private readonly logger = new Logger(WishlistService.name);
  constructor(
    private searchService: SearchService,
    @Inject(DrizzleAsyncProvider) private db: MySql2Database<any>,
  ) {}
  async createWishList(userId: number, productId: number): Promise<Wishlist> {
    try {
      const exist = await this.db
        .select()
        .from(wishlists)
        .where(
          and(eq(wishlists.userId, userId), eq(wishlists.productId, productId)),
        )
        .limit(1);
      this.logger.debug(`Wishlist ${JSON.stringify(exist)}`);

      if (exist.length > 0) {
        throw new ConflictException(WishlistErrorMessage.WISHLIST_EXISTS);
      }

      const [wishlistCreated] = await this.db.transaction(async (tx) => {
        return await tx
          .insert(wishlists)
          .values({
            userId,
            productId,
            created_at: new Date(),
            updated_at: new Date(),
          })
          .$returningId();
      });

      return await this.searchService.findOneOrThrow(
        this.db,
        wishlists,
        eq(wishlists.id, wishlistCreated.id),
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    } finally {
      this.logger.debug(
        `Wishlist created with product id ${productId} and user id ${userId}`,
      );
    }
  }

  async removeWishList(wishlistId: number, userId: number): Promise<Wishlist> {
    try {
      await this.searchService.findOneOrThrow(
        this.db,
        wishlists,
        and(eq(wishlists.userId, userId), eq(wishlists.id, wishlistId)),
        WishlistErrorMessage.WISHLIST_NOT_FOUND,
      );

      const result = await this.db.transaction(async (tx) => {
        return await tx
          .update(wishlists)
          .set({ status: WishlistStatus.REMOVED, updated_at: new Date() })
          .where(
            and(
              eq(wishlists.userId, userId),
              eq(wishlists.id, wishlistId),
              eq(wishlists.status, WishlistStatus.ACTIVE),
            ),
          );
      });

      if (!result) {
        this.logger.error('`${WishlistErrorMessage.WISHLIST_NOT_FOUND}`');
        throw new ConflictException(WishlistErrorMessage.WISHLIST_NOT_FOUND);
      }

      return await this.searchService.findOneOrThrow(
        this.db,
        wishlists,
        and(eq(wishlists.userId, userId), eq(wishlists.id, wishlistId)),
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    } finally {
      this.logger.log(`Update wishlist: ${wishlistId}`);
    }
  }
}
