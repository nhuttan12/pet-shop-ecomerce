import { Cart } from '@cart/entities/carts.entity';
import { CartDetailStatus } from '@cart/enums/cart-detail-status.enum';
import { CartStatus } from '@cart/enums/cart-status.enum';
import { CartErrorMessage } from '@cart/messages/cart.error-messages';
import { CartMessageLog } from '@cart/messages/cart.message-logs';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserStatus } from '@user/enums/user-status.enum';
import { DataSource, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class CartRepository {
  private readonly logger = new Logger(CartRepository.name);
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Cart)
    private readonly repo: Repository<Cart>,
  ) {}

  async getCartByUserIDAndStatus(
    userID: number,
    status: CartStatus,
  ): Promise<Cart | null> {
    try {
      return this.repo.findOne({
        where: {
          status,
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

  async updateCartStatus(cartID: number, status: CartStatus): Promise<boolean> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const result: UpdateResult = await manager.update(
          Cart,
          {
            id: cartID,
          },
          {
            status,
            updatedAt: new Date(),
          },
        );

        if (result.affected !== 1) {
          this.logger.error(CartMessageLog.UPDATE_CART_STATUS_FAILED);
          throw new InternalServerErrorException(
            CartErrorMessage.UPDATE_CART_STATUS_FAILED,
          );
        }

        return result.affected === 1;
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
