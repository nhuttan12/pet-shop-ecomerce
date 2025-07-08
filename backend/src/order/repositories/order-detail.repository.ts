import { CartDetail } from '@cart/entities/cart-details.entity';
import { Injectable, Logger } from '@nestjs/common';
import { OrderDetail } from '@order/entites/order-details.entity';
import { Order } from '@order/entites/orders.entity';
import { Product } from '@product/entites/products.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class OrderDetailRepository {
  private readonly logger = new Logger(OrderDetailRepository.name);
  constructor(
    private readonly dataSource: DataSource,
    private readonly repo: Repository<OrderDetail>,
  ) {}

  async createOrderDetails(cartDetails: CartDetail[]): Promise<OrderDetail[]> {
    try {
      const orderDetails: OrderDetail[] = cartDetails.map((cartDetail) => {
        const detail = new OrderDetail();
        detail.order = { id: cartDetail.cart.id } as Order;
        detail.product = { id: cartDetail.product.id } as Product;
        detail.quantity = cartDetail.quantity;
        detail.price = cartDetail.price;
        detail.totalPrice = cartDetail.quantity * cartDetail.price;
        return detail;
      });

      return await this.repo.save(orderDetails);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getAllOrderDetailByOrderID(
    orderID: number,
    userID: number,
  ): Promise<OrderDetail[]> {
    try {
      return await this.repo.find({
        where: {
          order: {
            id: orderID,
            user: {
              id: userID,
            },
          },
        },
        relations: {
          order: {
            user: true,
          },
          product: true,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
