import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  ProductErrorMessage,
  ProductMessageLog,
  ProductRating,
  RatingStatus,
} from '@product';
import { DataSource, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ProductRatingRepository {
  private readonly logger = new Logger(ProductRatingRepository.name);
  constructor(
    private readonly productRatingRepo: Repository<ProductRating>,
    private readonly dataSource: DataSource,
  ) {}

  async getRatingById(ratingID: number): Promise<ProductRating | null> {
    return this.productRatingRepo.findOneBy({ id: ratingID });
  }

  async getProductRatingByProduct(productID: number): Promise<ProductRating[]> {
    try {
      return await this.productRatingRepo.findBy({
        product: { id: productID },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getProductRatingByUserAndProduct(
    userID: number,
    productID: number,
  ): Promise<ProductRating | null> {
    try {
      return await this.productRatingRepo.findOneBy({
        user: { id: userID },
        product: { id: productID },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async createNewProductRating(
    userID: number,
    productID: number,
    starRated: number,
  ): Promise<ProductRating> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const productRating: ProductRating = manager.create(ProductRating, {
          user: { id: userID },
          product: { id: productID },
          starRated,
        });

        const result: ProductRating = await manager.save(productRating);

        if (!result) {
          this.logger.error(ProductMessageLog.CREATE_PRODUCT_RATING_FAILED);
          throw new InternalServerErrorException(
            ProductErrorMessage.CREATE_PRODUCT_RATING_FAILED,
          );
        }

        return result;
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateProductRating(
    ratingID: number,
    status: RatingStatus,
    starRated?: number,
  ): Promise<boolean> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const updatePayload: Partial<ProductRating> = {
          status,
          updatedAt: new Date(),
        };

        if (starRated !== undefined) {
          updatePayload.starRated = starRated;
        }

        const result: UpdateResult = await manager.update(
          ProductRating,
          {
            id: ratingID,
          },
          updatePayload,
        );

        if (result.affected === 0) {
          this.logger.error(ProductMessageLog.UPDATE_PRODUCT_RATING_FAILED);
          throw new InternalServerErrorException(
            ProductErrorMessage.UPDATE_PRODUCT_RATING_FAILED,
          );
        }

        return true;
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
