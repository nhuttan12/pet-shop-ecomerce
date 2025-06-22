import { ProductService } from '@core-modules/product/product/product.service';
import { UserService } from '@core-modules/user/user.service';
import { RatingStatus } from '@enum/status/customer-rating.enum';
import { DrizzleAsyncProvider } from '@helper-modules/database/drizzle.provider';
import { SearchService } from '@helper-modules/services/search.service';
import { ErrorMessage } from '@message/error-message';
import { NotifyMessage } from '@message/notify-message';
import { ProductRatingMessageLog } from '@message/product-rating-message';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { productRatings } from '@schema';
import { ProductRating, Product } from '@schema-type';
import { and, eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

@Injectable()
export class ProductRatingService {
  private readonly logger = new Logger(ProductRatingService.name);
  constructor(
    private productService: ProductService,
    private searchService: SearchService,
    private userService: UserService,
    @Inject(DrizzleAsyncProvider) private readonly db: MySql2Database<any>,
  ) {}

  private async getRatingById(id: number): Promise<ProductRating> {
    return await this.searchService.findOneOrThrow(
      this.db,
      productRatings,
      eq(productRatings.id, id),
    );
  }

  private async getRatingByProductId(id: number): Promise<ProductRating[]> {
    const product: Product = await this.productService.findProductById(id);

    return await this.searchService.findManyOrReturnEmptyArray(
      this.db,
      productRatings,
      eq(productRatings.productId, product.id),
    );
  }

  async toggleRatingProduct(
    userId: number,
    productId: number,
    starRated: number,
  ): Promise<string> {
    try {
      const product = await this.productService.findProductById(productId);
      this.logger.debug(`Get product: ${JSON.stringify(product)}`);

      const user = await this.userService.getUserById(userId);
      this.logger.debug(`Get user: ${JSON.stringify(user)}`);

      const existingRating = await this.findExistingRating(user.id, product.id);
      this.logger.debug(
        `Get existing rating: ${JSON.stringify(existingRating)}`,
      );

      let resultId: number | null = null;

      if (!existingRating) {
        resultId = await this.insertNewRating(user.id, product.id, starRated);

        return NotifyMessage.RATING_PRODUCT_SUCCESSFUL;
      } else if (
        (existingRating.status as RatingStatus) === RatingStatus.REMOVED
      ) {
        this.logger.debug(existingRating.status);

        await this.reactivateRating(existingRating.id, starRated);

        return NotifyMessage.RATING_PRODUCT_SUCCESSFUL;
      } else if (
        (existingRating.status as RatingStatus) === RatingStatus.ACTIVE
      ) {
        this.logger.debug(existingRating.status);
        await this.deactivateRating(existingRating.id);

        return NotifyMessage.REMOVE_RATING_PRODUCT_SUCCESSFUL;
      }

      if (!resultId) {
        this.logger.error(ProductRatingMessageLog.CANNOT_RATING_PRODUCT);
        throw new InternalServerErrorException(
          ErrorMessage.INTERNAL_SERVER_ERROR,
        );
      } else {
        return NotifyMessage.RATING_PRODUCT_SUCCESSFUL;
      }
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private async findExistingRating(
    userId: number,
    productId: number,
  ): Promise<ProductRating | undefined> {
    const [rating] = await this.db
      .select()
      .from(productRatings)
      .where(
        and(
          eq(productRatings.productId, productId),
          eq(productRatings.userId, userId),
        ),
      );
    return rating;
  }

  private async insertNewRating(
    userId: number,
    productId: number,
    starRated: number,
  ): Promise<number> {
    const [inserted] = await this.db.transaction(async (tx) => {
      return await tx
        .insert(productRatings)
        .values({
          userId,
          productId,
          starRated,
          created_at: new Date(),
          status: RatingStatus.ACTIVE,
        })
        .$returningId();
    });

    return inserted.id;
  }

  private async reactivateRating(
    ratingId: number,
    starRated: number,
  ): Promise<void> {
    await this.db.transaction(async (tx) => {
      await tx
        .update(productRatings)
        .set({
          starRated,
          updated_at: new Date(),
          status: RatingStatus.ACTIVE,
        })
        .where(eq(productRatings.id, ratingId));
    });
  }

  private async deactivateRating(ratingId: number): Promise<void> {
    await this.db.transaction(async (tx) => {
      await tx
        .update(productRatings)
        .set({
          updated_at: new Date(),
          status: RatingStatus.REMOVED,
        })
        .where(eq(productRatings.id, ratingId));
    });
  }
}
