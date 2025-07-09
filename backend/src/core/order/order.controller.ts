import { JwtPayload } from '@auth/interfaces/jwt-payload.interface';
import { ApiResponse } from '@api-response/ApiResponse';
import { HasRole } from '@decorators/roles.decorator';
import { GetUser } from '@decorators/user.decorator';
import { CatchEverythingFilter } from '@filters/exception.filter';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { NotifyMessage } from '@messages/notify.messages';
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
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse as ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CancelOrderRequestDto } from '@order/dto/cancel-order-request.dto';
import { CreateOrderRequestDto } from '@order/dto/create-order-request.dto';
import { GetAllOrderRequestDto } from '@order/dto/get-all-order-request.dto';
import { GetAllOrdersResponseDto } from '@order/dto/get-all-order-response.dto';
import { GetOrderDetailsByOrderIdRequestDto } from '@order/dto/get-order-details-by-order-id-request.dto';
import { GetOrderDetailsByOrderIdResponseDto } from '@order/dto/get-order-details-by-order-id-response.dto';
import { OrderDetailService } from '@order/order-detail.service';
import { OrderService } from '@order/order.service';
import { RoleName } from '@role/enums/role.enum';
import { Order } from '@order/entites/orders.entity';

@Controller('orders')
@ApiTags('Order')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard, RolesGuard)
@HasRole(RoleName.CUSTOMER)
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
