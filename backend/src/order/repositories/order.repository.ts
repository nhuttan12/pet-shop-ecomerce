import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  Order,
  OrderErrorMessage,
  OrderMessageLog,
  OrderStatus,
  PaymentMethod,
  ShippingMethod,
} from '@order';
import { DataSource, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class OrderRepository {
  private readonly logger = new Logger(OrderRepository.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly repo: Repository<Order>,
  ) {}

  async createOrder(
    userID: number,
    cartID: number,
    totalPrice: number,
    paymentMethod: PaymentMethod,
    shippingMethod: ShippingMethod,
    address: string,
    city: string,
    country: string,
  ) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const order: Order = manager.create(Order, {
          user: {
            id: userID,
          },
          cart: {
            id: cartID,
          },
          totalPrice,
          paymentMethod,
          shippingMethod,
          address,
          city,
          country,
          status: OrderStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return await manager.save(order);
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getAllOrders(
    userID: number,
    skip: number,
    take: number,
  ): Promise<Order[]> {
    try {
      return await this.repo.find({
        where: {
          user: {
            id: userID,
          },
        },
        relations: {
          user: true,
        },
        take,
        skip,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getOrderByOrderID(orderID: number): Promise<Order | null> {
    try {
      return await this.repo.findOne({
        where: {
          id: orderID,
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

  async updateStatusOrder(
    orderID: number,
    userID: number,
    orderStatus: OrderStatus,
  ): Promise<boolean> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const result: UpdateResult = await manager.update(
          Order,
          {
            id: orderID,
            user: {
              id: userID,
            },
          },
          {
            status: orderStatus,
            updatedAt: new Date(),
          },
        );

        if (result.affected !== 1) {
          this.logger.error(OrderMessageLog.UPDATE_ORDER_STATUS_FAILED);
          throw new InternalServerErrorException(
            OrderErrorMessage.UPDATE_ORDER_STATUS_FAILED,
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
