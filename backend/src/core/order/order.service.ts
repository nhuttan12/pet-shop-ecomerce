import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { CartDetailService } from '@cart/cart-detail.service';
import { CartService } from '@cart/cart.service';
import { CartDetailResponse } from '@cart/dto/cart-detail/cart-detail-response.dto';
import { CartDetail } from '@cart/entities/cart-details.entity';
import { Cart } from '@cart/entities/carts.entity';
import { CartDetailStatus } from '@cart/enums/cart-detail-status.enum';
import { CartStatus } from '@cart/enums/cart-status.enum';
import { CartErrorMessage } from '@cart/messages/cart.error-messages';
import { CartMessageLog } from '@cart/messages/cart.message-logs';
import { ErrorMessage } from '@messages/error.messages';
import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderRequestDto } from '@order/dto/create-order-request.dto';
import { GetAllOrdersResponseDto } from '@order/dto/get-all-order-response.dto';
import { OrderResponseDto } from '@order/dto/order-response.dto';
import { OrderDetail } from '@order/entites/order-details.entity';
import { Order } from '@order/entites/orders.entity';
import { OrderStatus } from '@order/enums/order-status.enum';
import { OrderErrorMessage } from '@order/messages/order.error-messages';
import { OrderMessageLog } from '@order/messages/order.message-logs';
import { OrderDetailService } from '@order/order-detail.service';
import { OrderRepository } from '@order/repositories/order.repository';
import { PaginationResponse } from '@pagination/pagination-response';
import { UtilityService } from '@services/utility.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly utilityService: UtilityService,
    private readonly orderRepo: OrderRepository,
    private readonly cartService: CartService,
    private readonly cartDetailService: CartDetailService,
    @Inject(forwardRef(() => OrderDetailService))
    private readonly orderDetailService: OrderDetailService,
  ) {}
  async getAllOrders(
    userID: number,
    limit: number,
    offset: number,
  ): Promise<GetAllOrdersResponseDto[]> {
    // 1. Get pagination information
    const { skip, take } = this.utilityService.getPagination(offset, limit);
    this.logger.debug('Skip: ', skip, 'Take: ', take);

    // 2. Get all orders
    const orderList = await this.orderRepo.getAllOrders(userID, skip, take);
    this.utilityService.logPretty('Order list: ', orderList);

    const result: GetAllOrdersResponseDto[] = orderList.map((o) => ({
      id: o.id,
      userID: o.user.id,
      totalPrice: o.totalPrice,
      paymentMethod: o.paymentMethod,
      shippingMethod: o.shippingMethod,
      status: o.status,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
    }));
    this.utilityService.logPretty('Order list:', result);

    return plainToInstance(GetAllOrdersResponseDto, result, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  async getOrderByOrderID(orderID: number): Promise<Order> {
    // 1. Get order by order ID
    const order: Order | null = await this.orderRepo.getOrderByOrderID(orderID);
    this.utilityService.logPretty('Order:', order);

    // 2. Check order exist
    if (!order) {
      this.logger.error(OrderErrorMessage.ORDER_NOT_FOUND);
      throw new NotFoundException(OrderErrorMessage.ORDER_NOT_FOUND);
    }

    // 3. Return order found
    return order;
  }

  async cancelOrder(
    orderID: number,
    userID: number,
  ): Promise<OrderResponseDto> {
    // 1. Finding order
    const order: Order = await this.getOrderByOrderID(orderID);
    this.utilityService.logPretty('Order:', order);

    // 2. Update order status to cancel
    const result = await this.updateStatusOrderByOrderIDAndUserID(
      order.id,
      userID,
      OrderStatus.CANCELED,
    );
    this.utilityService.logPretty('Update order status result:', result);

    // 3. Checking update status
    if (!result) {
      this.logger.warn(OrderErrorMessage.UPDATE_ORDER_STATUS_FAILED);
      throw new InternalServerErrorException(
        OrderErrorMessage.UPDATE_ORDER_STATUS_FAILED,
      );
    }

    // 4. Get new order after update
    const newOrder: Order = await this.getOrderByOrderID(orderID);

    // 5. Mapping to Order Response DTO
    return this.mapper.map(newOrder, Order, OrderResponseDto);
  }

  async updateStatusOrderByOrderIDAndUserID(
    orderID: number,
    userID: number,
    orderStatus: OrderStatus,
  ): Promise<boolean> {
    return this.orderRepo.updateStatusOrder(orderID, userID, orderStatus);
  }

  async createOrder(
    userID: number,
    request: CreateOrderRequestDto,
  ): Promise<OrderResponseDto> {
    // 1. Get cart by user ID and active status
    this.logger.verbose('Get cart by user ID and active status');
    const cart: Cart = await this.cartService.getCartByUserIDAndStatus(
      userID,
      CartStatus.ACTIVE,
    );
    this.utilityService.logPretty(
      'Get cart by user ID and active status result:',
      cart,
    );

    // 2. Check if cart exist
    this.logger.verbose('Check if cart exist');
    if (!cart) {
      this.logger.error(CartMessageLog.CART_NOT_FOUND);
      throw new InternalServerErrorException(CartErrorMessage.CART_NOT_FOUND);
    }

    // 3. Get cart detail by user ID
    this.logger.verbose('Get cart detail by user ID');
    const cartDetailsList: PaginationResponse<CartDetail> =
      await this.cartDetailService.getAllCartDetailPagingByUserID(
        userID,
        0,
        100,
      );
    this.utilityService.logPretty(
      'Get cart detail by user ID result:',
      cartDetailsList,
    );

    // 4. Check if cart detail exist
    this.logger.verbose('Check if cart detail exist');
    if (cartDetailsList.data.length === 0) {
      this.logger.warn(CartMessageLog.CART_IS_EMPTY);
      throw new InternalServerErrorException(CartErrorMessage.CART_IS_EMPTY);
    }

    // 5. Counting total price
    this.logger.verbose('Counting total price');
    let totalPrice: number = 0;
    if (request.paypalOrderId) {
      totalPrice = request.amount;
    } else {
      totalPrice = cartDetailsList.data.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
    }
    this.utilityService.logPretty('Total price:', totalPrice);

    // 6. Create new order
    this.logger.verbose('Create new order');
    const orderCreated: Order = await this.orderRepo.createOrder(
      userID,
      totalPrice,
      request.paymentMethod,
      request.shippingMethod,
      request.address,
      request.city,
      request.country,
      request.zipCode,
    );
    this.utilityService.logPretty('Order created:', orderCreated);

    // 7. Check order create result
    this.logger.verbose('Check order create result');
    if (!orderCreated) {
      this.logger.error(OrderMessageLog.CREATE_ORDER_FAILED);
      throw new InternalServerErrorException(
        OrderErrorMessage.CREATE_ORDER_FAILED,
      );
    }

    // 8. Create order detail for each cart detail
    this.logger.verbose('Create order detail for each cart detail');
    const orderDetails: OrderDetail[] =
      await this.orderDetailService.createOrderDetails(cartDetailsList.data);
    this.utilityService.logPretty('Order details created:', orderDetails);

    // 9. Update cart status to orderd
    this.logger.verbose('Update cart status to orderd');
    const result: boolean = await this.cartService.updateCartStatus(
      cart.id,
      CartStatus.ORDERED,
    );
    this.utilityService.logPretty('Update cart status result:', result);

    // 10. Return order created
    this.logger.verbose('Return order created');
    const newOrder: Order = await this.getOrderByOrderID(orderCreated.id);
    this.utilityService.logPretty('Order created:', newOrder);

    // 11. Update cart detail status to orderd
    this.logger.verbose('Update cart detail status to orderd');
    const cartDetail: CartDetailResponse[] =
      await this.cartDetailService.updateAllCartDetailStatusByUserID(
        userID,
        CartStatus.ORDERED,
        CartDetailStatus.ORDERED,
      );
    this.utilityService.logPretty(
      'Update cart detail status to orderd',
      cartDetail,
    );

    // 12. Check remove old cart detail result
    this.logger.verbose('Check remove old cart detail result');
    if (!cartDetail) {
      this.logger.error(CartMessageLog.REMOVE_CART_DETAIL_FAILED);
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    }

    // 13. Mapping to Order Response DTO
    this.logger.verbose('Mapping to Order Response DTO');
    return this.mapper.map(newOrder, Order, OrderResponseDto);
  }
}
