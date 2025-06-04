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
import { GetAllOrdersResponseDto } from 'src/helper/dto/order/get-all-order-response.dto';
import { OrderService } from './order.service';
import { GetUser } from 'src/helper/decorator/user.decorator';
import { GetAllOrderRequestDto } from 'src/helper/dto/order/get-all-order-request.dto';
import { ApiResponse } from 'src/helper/dto/response/ApiResponse/ApiResponse';
import { NotifyMessage } from 'src/helper/message/notify-message';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetOrderDetailsByOrderIdResponseDto } from 'src/helper/dto/order/get-order-details-by-order-id-response.dto';
import { GetOrderDetailsByOrderIdRequestDto } from 'src/helper/dto/order/get-order-details-by-order-id-request.dto';
import { CancelOrderRequestDto } from 'src/helper/dto/order/cancel-order-request.dto';
import { Order } from 'src/db/helper/schema-type';
import { CreateOrderRequestDto } from 'src/helper/dto/order/create-order-request.dto';
import { JwtAuthGuard } from 'src/helper/guard/jwt-auth.guard';
import { RolesGuard } from 'src/helper/guard/roles.guard';
import { HasRole } from 'src/helper/decorator/roles.decorator';
import { Role } from 'src/helper/enum/role.enum';
import { CatchEverythingFilter } from 'src/helper/filter/exception.filter';

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
  @ApiBody({ type: GetAllOrderRequestDto })
  @ApiOkResponse({ type: ApiResponse<GetAllOrdersResponseDto[]> })
  async getAllOrders(
    @Query() { limit, page }: GetAllOrderRequestDto,
    @GetUser() userId: number,
  ): Promise<ApiResponse<GetAllOrdersResponseDto[]>> {
    const orders = await this.orderService.getAllOrders(userId, limit, page);

    this.logger.debug(`Orders: ${JSON.stringify(orders)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_ORDER_SUCCESSFUL,
      data: orders,
    };
  }

  @Get('/order-detail/:id')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: GetOrderDetailsByOrderIdRequestDto })
  @ApiOkResponse({ type: ApiResponse<GetOrderDetailsByOrderIdResponseDto[]> })
  async getOrderDetailByOrderId(
    @Param() { orderId }: GetOrderDetailsByOrderIdRequestDto,
    @GetUser() userId: number,
  ): Promise<ApiResponse<GetOrderDetailsByOrderIdResponseDto[]>> {
    const orderDetails = await this.orderService.getOrderDetailByOrderId(
      orderId,
      userId,
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
  @ApiBody({ type: CancelOrderRequestDto })
  @ApiOkResponse({ type: ApiResponse<Order> })
  async cancelOrder(
    @Param() { orderId }: CancelOrderRequestDto,
    @GetUser() userId: number,
  ): Promise<ApiResponse<Order>> {
    const order = await this.orderService.cancelOrder(orderId, userId);
    this.logger.debug(`Order detail: ${JSON.stringify(order)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.CANCEL_ORDER_SUCCESSFUL,
      data: order,
    };
  }

  @Post('/create-order')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: CreateOrderRequestDto })
  @ApiOkResponse({ type: ApiResponse<Order> })
  async createOrder(
    @GetUser() userId: number,
    @Body() { paymentMethod, shippingMethod }: CreateOrderRequestDto,
  ): Promise<ApiResponse<Order>> {
    const order = await this.orderService.createOrder(
      userId,
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
