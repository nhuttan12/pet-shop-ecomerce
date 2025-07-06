import { Cart, CartDetailStatus, CartStatus } from '@cart';
import { Injectable, Logger } from '@nestjs/common';
import { UserStatus } from '@user';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CartRepository {
  private readonly logger = new Logger(CartRepository.name);
  constructor(
    private readonly dataSource: DataSource,
    private readonly repo: Repository<Cart>,
  ) {}

  async getCartByUserID(userID: number): Promise<Cart | null> {
    try {
      return this.repo.findOne({
        where: {
          status: CartStatus.ACTIVE,
          user: {
            id: userID,
          },
        },
        relations: {
          user: true,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async createCart(userID: number): Promise<Cart> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const cart: Cart = manager.create(Cart, {
          user: {
            id: userID,
          },
          status: CartStatus.ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return await manager.save(cart);
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getCartAndCartItemsByProductIDAndUserID(
    productID: number,
    userID: number,
  ): Promise<Cart | null> {
    try {
      return this.repo.findOne({
        where: {
          user: {
            id: userID,
            status: UserStatus.ACTIVE,
          },
          cartDetails: {
            status: CartDetailStatus.ACTIVE,
            product: {
              id: productID,
            },
          },
        },
        relations: {
          cartDetails: {
            product: true,
          },
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
