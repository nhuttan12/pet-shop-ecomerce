import { ErrorMessage } from '@messages/error.messages';
import { NotifyMessage } from '@messages/notify.messages';
import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ToggleRatingProductRequestDTO } from '@product/dto/toggle-rating-product-request.dto';
import { ProductRating } from '@product/entites/product-rating.entity';
import { RatingStatus } from '@product/enums/product-rating.enum';
import { ProductErrorMessage } from '@product/messages/product.error-messages';
import { ProductMessageLog } from '@product/messages/product.messages-log';
import { ProductService } from '@product/product.service';
import { ProductRatingRepository } from '@product/repositories/product-rating.repository';
import { UserService } from '@user/user.service';

@Injectable()
export class ProductRatingService {
  private readonly logger = new Logger(ProductRatingService.name);
  constructor(
    @Inject(forwardRef(() => ProductService))
    private productService: ProductService,
    private userService: UserService,
    private readonly productRatingRepo: ProductRatingRepository,
  ) {}

  private async getRatingById(id: number): Promise<ProductRating> {
    const productRating: ProductRating | null =
      await this.productRatingRepo.getRatingById(id);

    if (!productRating) {
      this.logger.error(ProductMessageLog.PRODUCT_RATING_NOT_FOUND);
      throw new NotFoundException(ProductErrorMessage.PRODUCT_RATING_NOT_FOUND);
    }

    return productRating;
  }

  async getRatingByProductId(productID: number): Promise<ProductRating[]> {
    return await this.productRatingRepo.getProductRatingByProduct(productID);
  }

  async toggleRatingProduct(
    userId: number,
    request: ToggleRatingProductRequestDTO,
  ): Promise<string> {
    try {
      // 1. Check product exist
      const product = await this.productService.getProductByID(
        request.productID,
      );
      this.logger.debug(`Get product: ${JSON.stringify(product)}`);

      // 2. Check user exist
      const user = await this.userService.getUserById(userId);
      this.logger.debug(`Get user: ${JSON.stringify(user)}`);

      // 3. Check rating exist
      const existingRating =
        await this.productRatingRepo.getProductRatingByUserAndProduct(
          user.id,
          product.id,
        );
      this.logger.debug(
        `Get existing rating: ${JSON.stringify(existingRating)}`,
      );

      let createProductingRatingResult: ProductRating | null = null;

      if (!existingRating) {
        createProductingRatingResult = await this.insertNewRating(
          user.id,
          product.id,
          request.starRated,
        );

        return NotifyMessage.RATING_PRODUCT_SUCCESSFUL;
      } else if (existingRating.status === RatingStatus.REMOVED) {
        this.logger.debug(existingRating.status);

        const ratingProductResult: boolean = await this.reactivateRating(
          existingRating.id,
          request.starRated,
        );

        if (!ratingProductResult) {
          this.logger.error(ProductMessageLog.CANNOT_RATING_PRODUCT);
          throw new InternalServerErrorException(
            ProductErrorMessage.RATING_PRODUCT_FAILED,
          );
        }

        return NotifyMessage.RATING_PRODUCT_SUCCESSFUL;
      } else if (
        (existingRating.status as RatingStatus) === RatingStatus.ACTIVE
      ) {
        this.logger.debug(existingRating.status);

        const ratingProductResult: boolean = await this.deactivateRating(
          existingRating.id,
        );

        if (!ratingProductResult) {
          this.logger.error(ProductMessageLog.CANNOT_RATING_PRODUCT);
          throw new InternalServerErrorException(
            ProductErrorMessage.RATING_PRODUCT_FAILED,
          );
        }

        return NotifyMessage.REMOVE_RATING_PRODUCT_SUCCESSFUL;
      }

      if (!createProductingRatingResult) {
        this.logger.error(ProductMessageLog.CANNOT_RATING_PRODUCT);
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

  private async insertNewRating(
    userID: number,
    productID: number,
    starRated: number,
  ): Promise<ProductRating> {
    return await this.productRatingRepo.createNewProductRating(
      userID,
      productID,
      starRated,
    );
  }

  private async reactivateRating(
    ratingID: number,
    starRated: number,
  ): Promise<boolean> {
    const result: boolean = await this.productRatingRepo.updateProductRating(
      ratingID,
      RatingStatus.ACTIVE,
      starRated,
    );

    if (!result) {
      this.logger.warn(ProductMessageLog.UPDATE_PRODUCT_RATING_FAILED);
      throw new InternalServerErrorException(
        ProductErrorMessage.UPDATE_PRODUCT_RATING_FAILED,
      );
    }

    return true;
  }

  private async deactivateRating(ratingID: number): Promise<boolean> {
    const result: boolean = await this.productRatingRepo.updateProductRating(
      ratingID,
      RatingStatus.REMOVED,
    );

    if (!result) {
      this.logger.warn(ProductMessageLog.UPDATE_PRODUCT_RATING_FAILED);
      throw new InternalServerErrorException(
        ProductErrorMessage.UPDATE_PRODUCT_RATING_FAILED,
      );
    }

    return true;
  }
}
