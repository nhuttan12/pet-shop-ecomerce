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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
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
import { GetOrderDetailsByOrderIDRequestDto } from '@order/dto/get-order-details-by-order-i-d-request.dto';
import { GetOrderDetailsByOrderIDResponseDto } from '@order/dto/get-order-details-by-order-i-d-response.dto';
import { OrderDetailService } from '@order/order-detail.service';
import { OrderService } from '@order/order.service';
import { RoleName } from '@role/enums/role.enum';
import { OrderResponseDto } from '@order/dto/order-response.dto';
import { UtilityService } from '@services/utility.service';
import { GetOrderListByOrderIdRequestDto } from '@order/dto/get-order-list-by-order-id-request-dto';
import { FindOrderListByOrderStatusRequestDto } from '@order/dto/find-order-list-by-order-status-request.dto';
import { OrderStatus } from '@order/enums/order-status.enum';

@Controller('orders')
@ApiTags('Order')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard, RolesGuard)
@HasRole(RoleName.CUSTOMER)
@UseFilters(CatchEverythingFilter)
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(
    private readonly utilityService: UtilityService,
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
    // 1. Get all orders in controller
    this.logger.verbose('Get all orders in controller');
    const orders = await this.orderService.getAllOrders(
      userId.sub,
      limit,
      page,
    );
    this.utilityService.logPretty('Orders: ', orders);

    // 2. Create response
    this.logger.verbose('Create response');
    const response: ApiResponse<GetAllOrdersResponseDto[]> = {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_ORDER_SUCCESSFUL,
      data: orders,
    };

    // 3. Returning response
    this.logger.verbose('Returning response');
    return response;
  }

  @Get('/order-detail/:orderID')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy chi tiết đơn hàng theo orderID' })
  @ApiParam({ name: 'id', type: Number, description: 'Order ID' })
  @ApiOkResponse({
    type: ApiResponse<GetOrderDetailsByOrderIDResponseDto[]>,
    description: 'Chi tiết đơn hàng trả về thành công',
  })
  async getOrderDetailByOrderID(
    @Param() { orderID }: GetOrderDetailsByOrderIDRequestDto,
    @GetUser() payload: JwtPayload,
  ): Promise<ApiResponse<GetOrderDetailsByOrderIDResponseDto[]>> {
    const orderDetails = await this.orderDetailService.getOrderDetailByOrderID(
      orderID,
      payload.sub,
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
    type: ApiResponse<OrderResponseDto>,
    description: 'Hủy đơn hàng thành công',
  })
  async cancelOrder(
    @Param() { orderId }: CancelOrderRequestDto,
    @GetUser() userId: JwtPayload,
  ): Promise<ApiResponse<OrderResponseDto>> {
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
    type: ApiResponse<OrderResponseDto>,
    description: 'Tạo đơn hàng thành công',
  })
  async createOrder(
    @GetUser() userId: JwtPayload,
    @Body()
    request: CreateOrderRequestDto,
  ): Promise<ApiResponse<OrderResponseDto>> {
    const order = await this.orderService.createOrder(userId.sub, request);
    this.logger.debug(`Order detail: ${JSON.stringify(order)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.CREATE_ORDER_SUCCESSFUL,
      data: order,
    };
  }

  @Get('/list')
  @ApiOperation({ summary: 'Get order list by order ID' })
  @ApiQuery({
    name: 'orderID',
    required: true,
    type: Number,
    description: 'The ID of the order to search for',
  })
  @ApiOkResponse({
    status: 200,
    description: 'Successful response',
    type: [GetAllOrdersResponseDto],
  })
  @ApiOkResponse({ status: 400, description: 'Invalid order ID' })
  @ApiOkResponse({ status: 500, description: 'Internal server error' })
  async getOrderListByOrderID(
    @Query() request: GetOrderListByOrderIdRequestDto,
  ): Promise<ApiResponse<GetAllOrdersResponseDto[]>> {
    // 1. Get order list from service
    this.logger.verbose('Get order list from service');
    const orderList: GetAllOrdersResponseDto[] =
      await this.orderService.findOrderListByOrderID(request.orderID);
    this.utilityService.logPretty('Get order list from service', orderList);

    // 2. Create response
    this.logger.verbose('Create response');
    const response: ApiResponse<GetAllOrdersResponseDto[]> = {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_ORDER_SUCCESSFUL,
      data: orderList,
    };
    this.utilityService.logPretty('Create response for client', response);

    // 3. Return response to client
    this.logger.verbose('Return response to client');
    return response;
  }

  @Get('/list-by-status')
  @ApiOperation({ summary: 'Get order list by status' })
  @ApiQuery({
    name: 'status',
    required: true,
    enum: OrderStatus,
    description: 'Order status to filter orders by',
  })
  @ApiOkResponse({
    description: 'Successful response with a list of orders',
    type: GetAllOrdersResponseDto,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'Invalid or missing order status',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async findOrderListByOrderStatus(
    @Query() request: FindOrderListByOrderStatusRequestDto,
    @GetUser() payload: JwtPayload,
  ): Promise<ApiResponse<GetAllOrdersResponseDto[]>> {
    // 1. Get order list from service
    this.logger.verbose('Get order list from service');
    const orderList: GetAllOrdersResponseDto[] =
      await this.orderService.findOrderListByOrderStatusAndUserID(
        request,
        payload.sub,
      );
    this.utilityService.logPretty('Get order list from service', orderList);

    // 2. Create response
    this.logger.verbose('Create response');
    const response: ApiResponse<GetAllOrdersResponseDto[]> = {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_ORDER_SUCCESSFUL,
      data: orderList,
    };
    this.utilityService.logPretty('Create response for client', response);

    // 3. Return response to client
    this.logger.verbose('Return response to client');
    return response;
  }
}
