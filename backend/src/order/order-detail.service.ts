import { CartDetail } from '@cart';
import { Image, ImageService, ImageType, SubjectType } from '@common';
import { Injectable, Logger } from '@nestjs/common';
import {
  GetOrderDetailsByOrderIdResponseDto,
  OrderDetail,
  OrderDetailRepository,
  OrderErrorMessage,
  OrderMessageLog,
} from '@order';

@Injectable()
export class OrderDetailService {
  private readonly logger = new Logger(OrderDetailService.name);
  constructor(
    private readonly orderDetailRepo: OrderDetailRepository,
    private readonly imageService: ImageService,
  ) {}
  async getOrderDetailByOrderId(
    orderID: number,
    userID: number,
  ): Promise<GetOrderDetailsByOrderIdResponseDto[]> {
    // 1. Get all order detail by user ID
    const orderDetailList =
      await this.orderDetailRepo.getAllOrderDetailByOrderID(orderID, userID);
    this.logger.debug('Order detail list:', orderDetailList);

    // 2. Mapping to DTO
    const orderDetailDtos: GetOrderDetailsByOrderIdResponseDto[] =
      await Promise.all(
        orderDetailList.map(async (detail: OrderDetail) => {
          // 3. Get image by product ID
          const image: Image =
            await this.imageService.getImageBySubjectIdAndSubjectType(
              detail.product.id,
              SubjectType.PRODUCT,
              ImageType.THUMBNAIL,
            );
          this.logger.debug('Image: ', image);

          // 4. Returning and mapping to dto
          return {
            id: detail.id,
            orderId: detail.order.id,
            productname: detail.product.name,
            imageUrl: image.url,
            quantity: detail.quantity,
            price: detail.price,
            totalPrice: detail.totalPrice,
          };
        }),
      );

    return orderDetailDtos;
  }

  async createOrderDetails(cartDetails: CartDetail[]): Promise<OrderDetail[]> {
    try {
      // 1. Create order detail
      const orderDetails: OrderDetail[] =
        await this.orderDetailRepo.createOrderDetails(cartDetails);

      // 2. Check if order detail created
      if (orderDetails.length === 0) {
        this.logger.warn(OrderMessageLog.CREATE_ORDER_DETAIL_FAILED);
        throw new Error(OrderErrorMessage.CREATE_ORDER_DETAIL_FAILED);
      }

      // 3. Returning
      return orderDetails;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
