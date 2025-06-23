import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import { and, eq, inArray } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import {
  brands,
  categories,
  categoriesMapping,
  images,
  productImages,
  products,
  wishlists,
} from '@schema';
import { WishlistStatus } from '@enum/status/wishlist-status.enum';
import { DrizzleAsyncProvider } from '@helper-modules/database/drizzle.provider';
import { SearchService } from '@helper-modules/services/search.service';
import { Wishlist } from '@schema-type';
import { WishlistErrorMessage } from '@message/wishlist-message';
import { UtilityService } from '@helper-modules/services/utility.service';
import { GetAllProductResponseDto } from '@dtos/product/get-all-product-response.dto';
import { ImageType } from '@enum/image-type.enum';

@Injectable()
export class WishlistService {
  private readonly logger = new Logger(WishlistService.name);
  constructor(
    private searchService: SearchService,
    private utilityService: UtilityService,
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

  async getWishlistProducts(userId: number, limit: number, offset: number) {
    const { skip, take } = this.utilityService.getPagination(offset, limit);

    // Step 1: Get wishlist list join with products and brands
    const wishlistProductList = await this.db
      .select()
      .from(wishlists)
      .innerJoin(products, eq(wishlists.productId, products.id))
      .innerJoin(brands, eq(products.brandId, brands.id))
      .where(eq(wishlists.userId, userId))
      .limit(take)
      .offset(skip);

    const productIds = wishlistProductList.map((item) => item.products.id);

    // Step 2: get thumbnail image for each product
    const imageList = await this.db
      .select()
      .from(productImages)
      .innerJoin(images, eq(productImages.imageId, images.id))
      .where(inArray(productImages.productId, productIds));

    // Step 3: get info of category
    const categoryList = await this.db
      .select()
      .from(categoriesMapping)
      .innerJoin(categories, eq(categoriesMapping.categoryId, categories.id))
      .where(inArray(categoriesMapping.productId, productIds));

    // Step 4: Map result
    const result: GetAllProductResponseDto[] = wishlistProductList.map(
      (item) => ({
        id: item.products.id,
        name: item.products.name,
        description: item.products.description,
        price: item.products.price,
        brandName: item.brands.name,
        categoryName: '',
        thumbnailUrl: '',
        status: item.products.status,
        stock: item.products.stocking,
      }),
    );

    for (const prod of result) {
      const thumb = imageList.find(
        (img) =>
          img.product_images.productId === prod.id &&
          (img.images.type as ImageType) === ImageType.THUMBNAIL,
      );

      if (thumb) {
        prod.thumbnailUrl = thumb.images.url;
      }

      const cate = categoryList.find(
        (c) => c.categories_mapping.productId === prod.id,
      );

      if (cate) {
        prod.categoryName = cate.categories.name;
      }
    }

    return result;
  }
}
