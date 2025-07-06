import { JwtPayload } from '@auth';
import {
  ApiResponse,
  CatchEverythingFilter,
  GetUser,
  HasRole,
  JwtAuthGuard,
  NotifyMessage,
  RolesGuard,
} from '@common';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  CancelOrderRequestDto,
  CreateOrderRequestDto,
  GetAllOrderRequestDto,
  GetAllOrdersResponseDto,
  GetOrderDetailsByOrderIdRequestDto,
  GetOrderDetailsByOrderIdResponseDto,
  Order,
  OrderDetailService,
  OrderService,
} from '@order';
import { RoleName } from '@role';

@Controller('orders')
@ApiTags('Order')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard, RolesGuard)
@HasRole(RoleName.USER)
@UseFilters(CatchEverythingFilter)
export class OrderController {
  private readonly logger = new Logger(OrderController.name);
  constructor(
    private readonly orderService: OrderService,
    private readonly orderDetailService: OrderDetailService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy danh sách đơn hàng (của user đang đăng nhập)' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Số lượng đơn mỗi trang',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Trang số',
  })
  @ApiOkResponse({
    type: ApiResponse<GetAllOrdersResponseDto[]>,
    description: 'Danh sách đơn hàng trả về thành công',
  })
  async getAllOrders(
    @Query() { limit, page }: GetAllOrderRequestDto,
    @GetUser() userId: JwtPayload,
  ): Promise<ApiResponse<GetAllOrdersResponseDto[]>> {
    const orders = await this.orderService.getAllOrders(
      userId.sub,
      limit,
      page,
    );

    this.logger.debug(`Orders: ${JSON.stringify(orders)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_ORDER_SUCCESSFUL,
      data: orders,
    };
  }

  @Get('/order-detail/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy chi tiết đơn hàng theo orderId' })
  @ApiParam({ name: 'id', type: Number, description: 'Order ID' })
  @ApiOkResponse({
    type: ApiResponse<GetOrderDetailsByOrderIdResponseDto[]>,
    description: 'Chi tiết đơn hàng trả về thành công',
  })
  async getOrderDetailByOrderId(
    @Param() { orderId }: GetOrderDetailsByOrderIdRequestDto,
    @GetUser() userId: JwtPayload,
  ): Promise<ApiResponse<GetOrderDetailsByOrderIdResponseDto[]>> {
    const orderDetails = await this.orderDetailService.getOrderDetailByOrderId(
      orderId,
      userId.sub,
    );
    this.logger.debug(`Order detail: ${JSON.stringify(orderDetails)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_ORDER_SUCCESSFUL,
      data: orderDetails,
    };
  }

  @Put('/cancel/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Hủy đơn hàng' })
  @ApiParam({ name: 'id', type: Number, description: 'Order ID' })
  @ApiBody({ type: CancelOrderRequestDto })
  @ApiOkResponse({
    type: ApiResponse<Order>,
    description: 'Hủy đơn hàng thành công',
  })
  async cancelOrder(
    @Param() { orderId }: CancelOrderRequestDto,
    @GetUser() userId: JwtPayload,
  ): Promise<ApiResponse<Order>> {
    const order = await this.orderService.cancelOrder(orderId, userId.sub);
    this.logger.debug(`Order detail: ${JSON.stringify(order)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.CANCEL_ORDER_SUCCESSFUL,
      data: order,
    };
  }

  @Post('/create-order')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Tạo đơn hàng mới' })
  @ApiBody({ type: CreateOrderRequestDto })
  @ApiOkResponse({
    type: ApiResponse<Order>,
    description: 'Tạo đơn hàng thành công',
  })
  async createOrder(
    @GetUser() userId: JwtPayload,
    @Body()
    {
      paymentMethod,
      shippingMethod,
      city,
      country,
      address,
    }: CreateOrderRequestDto,
  ): Promise<ApiResponse<Order>> {
    const order = await this.orderService.createOrder(
      userId.sub,
      paymentMethod,
      shippingMethod,
      city,
      country,
      address,
    );
    this.logger.debug(`Order detail: ${JSON.stringify(order)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.CREATE_ORDER_SUCCESSFUL,
      data: order,
    };
  }
}
