import { Injectable, Logger } from '@nestjs/common';
import { Wishlist, WishlistStatus } from '@wishlist';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class WishlistRepository {
  private readonly logger = new Logger(WishlistRepository.name);
  constructor(
    private readonly dataSource: DataSource,
    private readonly repo: Repository<Wishlist>,
  ) {}

  async createWishlist(userID: number): Promise<Wishlist> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const wishlistCreated = manager.create(Wishlist, {
          user: { id: userID },
        });
        return await manager.save(wishlistCreated);
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getWishtListByUserID(userID: number): Promise<Wishlist | null> {
    try {
      return await this.repo.findOne({
        where: {
          id: userID,
        },
        order: {
          id: 'ASC',
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getWishlistAndWishlistMappingByUserID(
    userID: number,
  ): Promise<Wishlist | null> {
    try {
      return await this.repo.findOne({
        where: {
          user: {
            id: userID,
          },
          wishlistMappings: {
            status: WishlistStatus.ACTIVE,
          },
        },
        relations: {
          wishlistMappings: true,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
