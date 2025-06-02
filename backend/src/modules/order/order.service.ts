import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { and, eq, inArray } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { GetAllOrdersResponseDto } from 'src/helper/dto/order/get-all-order-response.dto';
import { DrizzleAsyncProvider } from '../database/drizzle.provider';
import { orders } from './../../db/schema/orders.schema';
import { SearchService } from 'src/helper/services/search.service';
import { images, orderDetails, productImages, products } from 'src/db/schema';
import { GetOrderDetailsByOrderIdResponseDto } from 'src/helper/dto/order/get-order-details-by-order-id-response.dto';
import { ImageStatus } from 'src/helper/enum/status/image-status.enum';
import { ImageType } from 'src/helper/enum/image-type.enum';
import { Property } from 'src/helper/message/property';
import { ErrorMessage } from 'src/helper/message/error-message';
import { OrderStatus } from 'src/helper/enum/status/order-status.enum';
import { MessageLog } from 'src/helper/message/message-log';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: MySql2Database<any>,
    private searchService: SearchService,
  ) {}
  async getAllOrders(
    userId: number,
    limit: number,
    offset: number,
  ): Promise<GetAllOrdersResponseDto[]> {
    const orderList = await this.db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .limit(limit)
      .offset(offset);
    this.logger.debug(`Order list ${JSON.stringify(orderList)}`);

    const result: GetAllOrdersResponseDto[] = orderList.map((o) => ({
      id: o.id,
      userId: o.userId,
      totalPrice: o.totalPrice,
      paymentMethod: o.paymentMethod,
      shippingMethod: o.shippingMethod,
      status: o.status,
      createdAt: o.created_at,
      updatedAt: o.updated_at,
    }));
    this.logger.debug(`Order list ${JSON.stringify(result)}`);

    return result;
  }
  async getOrderDetailByOrderId(
    orderId: number,
  ): Promise<GetOrderDetailsByOrderIdResponseDto[]> {
    const orderDetailList = await this.db
      .select()
      .from(orders)
      .innerJoin(orderDetails, eq(orders.id, orderDetails.orderId))
      .where(eq(orderDetails.orderId, orderId));

    const productIds: number[] = orderDetailList.map(
      (od) => od.order_details.productId,
    );

    const iamgeList = await this.db
      .select()
      .from(productImages)
      .innerJoin(images, eq(productImages.imageId, images.id))
      .where(
        and(
          inArray(productImages.productId, productIds),
          eq(images.status, ImageStatus.ACTIVE),
          eq(images.type, ImageType.THUMBNAIL),
        ),
      );

    const productList = await this.db
      .select()
      .from(products)
      .where(inArray(products.id, productIds));

    const result: GetOrderDetailsByOrderIdResponseDto[] = orderDetailList.map(
      (od) => {
        const img = iamgeList.find(
          (img) => img.product_images.productId === od.order_details.productId,
        );

        if (!img) {
          this.logger.error(`${MessageLog.CATEGORY_NOT_FOUND}`);
          throw new NotFoundException(
            `${Property.IMAGE} ${ErrorMessage.NOT_EXIST}`,
          );
        }

        const prod = productList.find(
          (prod) => prod.id === od.order_details.productId,
        );

        if (!prod) {
          this.logger.error(`${MessageLog.PRODUCT} ${MessageLog.NOT_FOUND}`);
          throw new NotFoundException(
            `${Property.PRODUCT} ${ErrorMessage.NOT_EXIST}`,
          );
        }

        return {
          id: od.order_details.id,
          orderId: od.order_details.orderId,
          productname: prod.name,
          imageUrl: img.images.url,
          quantity: od.order_details.quantity,
          price: od.order_details.price,
          totalPrice: od.order_details.totalPrice,
        };
      },
    );

    return result;
  }
  async cancelOrder(orderId: number) {
    const order = await this.searchService.findOneOrThrow(
      this.db,
      orders,
      eq(orders.id, orderId),
    );

    const result = await this.db.transaction(async (tx) => {
      return await tx
        .update(orders)
        .set({ status: OrderStatus.Canceled, updated_at: new Date() })
        .where(eq(orders.id, orderId));
    });

    if (!result) {
      this.logger.error(`${MessageLog.ORDER} ${MessageLog.NOT_FOUND}`);
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    }

    return order;
  }
  async insertOrder() {}
}
