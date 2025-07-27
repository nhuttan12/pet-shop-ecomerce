import { CreateCartDetailDto } from '@cart/dto/cart-detail/create-cart-detail.dto';
import { CartDetail } from '@cart/entities/cart-details.entity';
import { CartDetailStatus } from '@cart/enums/cart-detail-status.enum';
import { CartErrorMessage } from '@cart/messages/cart.error-messages';
import { CartMessageLog } from '@cart/messages/cart.message-logs';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { buildPaginationMeta } from '@pagination/build-pagination-meta';
import { PaginationResponse } from '@pagination/pagination-response';
import { UtilityService } from '@services/utility.service';
import { DataSource, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class CartDetailRepository {
  private readonly logger = new Logger(CartDetailRepository.name);
  constructor(
    private readonly utilityService: UtilityService,
    private readonly dataSource: DataSource,
    @InjectRepository(CartDetail)
    private readonly repo: Repository<CartDetail>,
  ) {}

  async getAllCartDetailByUserID(
    userID: number,
    skip: number,
    take: number,
  ): Promise<PaginationResponse<CartDetail>> {
    try {
      // 1. Get cart details and total items
      const [cartDetailList, cartTotalItems] = await this.repo.findAndCount({
        where: {
          cart: {
            user: {
              id: userID,
            },
          },
          status: CartDetailStatus.ACTIVE,
        },
        relations: {
          cart: {
            user: true,
          },
          product: true,
        },
        skip,
        take,
      });
      this.utilityService.logPretty('Get cart details', cartDetailList);
      this.utilityService.logPretty('Cart detail total items', cartTotalItems);

      // 2. Calculate current page
      const currentPage: number = skip > 0 ? Math.floor(skip / take) + 1 : 1;
      this.utilityService.logPretty('Current page', currentPage);

      // 3. Calculate meta
      const meta = buildPaginationMeta(cartTotalItems, currentPage, take);
      this.utilityService.logPretty('Meta', meta);

      return {
        data: cartDetailList,
        meta,
      };
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
          product: true,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
