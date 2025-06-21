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
import { GetAllOrdersResponseDto } from '@dtos/order/get-all-order-response.dto';
import { OrderService } from '@core-modules/order/order.service';
import { GetUser } from '@decorator/user.decorator';
import { GetAllOrderRequestDto } from '@dtos/order/get-all-order-request.dto';
import { ApiResponse } from '@dtos/response/ApiResponse/ApiResponse';
import { NotifyMessage } from '@message/notify-message';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@guard/jwt-auth.guard';
import { RolesGuard } from '@guard/roles.guard';
import { HasRole } from '@decorator/roles.decorator';
import { Role } from '@enum/role.enum';
import { CatchEverythingFilter } from '@filter/exception.filter';
import { JwtPayload } from '@interfaces';
import { GetOrderDetailsByOrderIdResponseDto } from '@dtos/order/get-order-details-by-order-id-response.dto';
import { GetOrderDetailsByOrderIdRequestDto } from '@dtos/order/get-order-details-by-order-id-request.dto';
import { CancelOrderRequestDto } from '@dtos/order/cancel-order-request.dto';
import { Order } from '@schema-type';
import { CreateOrderRequestDto } from '@dtos/order/create-order-request.dto';

@Controller('orders')
@ApiTags('Order')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard, RolesGuard)
@HasRole(Role.USER)
@UseFilters(CatchEverythingFilter)
export class OrderController {
  private readonly logger = new Logger(OrderController.name);
  constructor(private orderService: OrderService) {}

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
    const orderDetails = await this.orderService.getOrderDetailByOrderId(
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
    @Body() { paymentMethod, shippingMethod }: CreateOrderRequestDto,
  ): Promise<ApiResponse<Order>> {
    const order = await this.orderService.createOrder(
      userId.sub,
      paymentMethod,
      shippingMethod,
    );
    this.logger.debug(`Order detail: ${JSON.stringify(order)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.CREATE_ORDER_SUCCESSFUL,
      data: order,
    };
  }
}
