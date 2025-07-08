import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { WishlistMapping } from '@wishlist/entities/wishlist-mapping.entity';
import { WishlistStatus } from '@wishlist/enums/wishlist-status.enum';
import { WishlistErrorMessage } from '@wishlist/messages/wishlist.error-messages';
import { WishlistMessageLog } from '@wishlist/messages/wishlist.message-logs';
import { DataSource, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class WishlistMappingRepository {
  private readonly logger = new Logger(WishlistMappingRepository.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly repo: Repository<WishlistMapping>,
  ) {}

  async createWishlistMapping(
    wishlistID: number,
    productID: number,
  ): Promise<WishlistMapping> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const wishlistMapping: WishlistMapping = manager.create(
          WishlistMapping,
          {
            wishlist: {
              id: wishlistID,
            },
            product: {
              id: productID,
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        );

        return await manager.save(wishlistMapping);
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getAllWishlistMappingByWishlistId(
    wishlistID: number,
    skip: number,
    take: number,
  ): Promise<WishlistMapping[]> {
    try {
      return await this.repo.find({
        where: { wishlist: { id: wishlistID, status: WishlistStatus.ACTIVE } },
        order: { id: 'ASC' },
        skip,
        take,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getWishlistMappingByUserIDAndProductID(
    wishlistID: number,
    productID: number,
  ): Promise<WishlistMapping | null> {
    try {
      return await this.repo.findOne({
        where: {
          wishlist: {
            id: wishlistID,
          },
          product: {
            id: productID,
          },
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async removeWishlistMapping(
    userID: number,
    productID: number,
  ): Promise<boolean> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const result: UpdateResult = await manager.update(
          WishlistMapping,
          {
            user: { id: userID },
            product: { id: productID },
            status: WishlistStatus.ACTIVE,
          },
          {
            status: WishlistStatus.REMOVED,
            updatedAt: new Date(),
          },
        );

        if (result.affected === 0) {
          this.logger.error(WishlistMessageLog.WISHLIST_MAPPING_REMOVED_FAILED);
          throw new InternalServerErrorException(
            WishlistErrorMessage.WISHLIST_MAPPING_REMOVED_FAILED,
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
