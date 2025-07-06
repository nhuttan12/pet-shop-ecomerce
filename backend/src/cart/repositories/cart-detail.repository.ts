import {
  CartDetail,
  CartDetailStatus,
  CartErrorMessage,
  CartMessageLog,
  CreateCartDetailDto,
} from '@cart';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DataSource, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class CartDetailRepository {
  private readonly logger = new Logger(CartDetailRepository.name);
  constructor(
    private readonly dataSource: DataSource,
    private readonly repo: Repository<CartDetail>,
  ) {}

  async getAllCartDetailByUserID(
    userID: number,
    skip?: number,
    take?: number,
  ): Promise<CartDetail[]> {
    try {
      return this.repo.find({
        where: {
          cart: {
            user: {
              id: userID,
            },
          },
          status: CartDetailStatus.ACTIVE,
        },
        skip,
        take,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async addProductToCartDetails(
    request: CreateCartDetailDto,
  ): Promise<CartDetail> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const cartDetail: CartDetail = manager.create(CartDetail, {
          cart: {
            id: request.cartId,
          },
          product: {
            id: request.productId,
          },
          quantity: request.quantity,
          price: request.price,
          status: CartDetailStatus.ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return await manager.save(cartDetail);
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async removeCartItem(cartID: number, productID: number): Promise<boolean> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const result: UpdateResult = await manager.update(
          CartDetail,
          {
            cart: {
              id: cartID,
            },
            product: {
              id: productID,
            },
          },
          {
            status: CartDetailStatus.REMOVED,
            updatedAt: new Date(),
          },
        );

        if (result.affected === 0) {
          this.logger.error(CartMessageLog.REMOVE_CART_DETAIL_FAILED);
          throw new InternalServerErrorException(
            CartErrorMessage.REMOVE_CART_DETAIL_FAILED,
          );
        }

        return true;
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getCartDetailByProductIDAndCartID(
    productID: number,
    cartID: number,
  ): Promise<CartDetail | null> {
    try {
      return await this.repo.findOne({
        where: {
          cart: {
            id: cartID,
          },
          product: {
            id: productID,
          },
          status: CartDetailStatus.ACTIVE,
        },
        relations: {
          cart: true,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
