import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { buildPaginationMeta } from '@pagination/build-pagination-meta';
import { PaginationResponse } from '@pagination/pagination-response';
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
    @InjectRepository(WishlistMapping)
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

  async getAllWishlistMappingByUserID(
    userID: number,
    skip: number,
    take: number,
  ): Promise<PaginationResponse<WishlistMapping>> {
    try {
      // 1. Get wishlist mapping join wishlist and user
      const [wishlistMappings, totalItems] = await this.repo.findAndCount({
        where: {
          wishlist: { user: { id: userID }, status: WishlistStatus.ACTIVE },
        },
        order: { id: 'ASC' },
        relations: {
          wishlist: {
            user: true,
          },
        },
        skip,
        take,
      });

      // 2. Build pagination meta
      const meta = buildPaginationMeta(
        totalItems,
        Math.floor(take / skip) + 1,
        take,
      );

      return {
        data: wishlistMappings,
        meta,
      };
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
