import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CaptureOrderDto } from '@payment/dto/capture-order.dto';
import { CreateOrderDto } from '@payment/dto/create-order.dto';
import { ApiResponse } from '@api-response/ApiResponse';
import { PaymentNotifyMessage } from '@payment/messages/payment.notify-messages';
import { Status } from '@paypal/checkout-server-sdk/lib/payments/lib';
import { Order } from '@paypal/checkout-server-sdk/lib/orders/lib';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { CatchEverythingFilter } from '@filters/exception.filter';
import { HasRole } from '@decorators/roles.decorator';
import { RoleName } from '@role/enums/role.enum';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiQuery,
  ApiResponse as SwaggerResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GetUser } from '@decorators/user.decorator';
import { JwtPayload } from '@auth/interfaces/jwt-payload.interface';

@ApiTags('Payment')
@Controller('payment')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard, RolesGuard)
@HasRole(RoleName.ADMIN, RoleName.CUSTOMER)
@UseFilters(CatchEverythingFilter)
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  @ApiOperation({ summary: 'Tạo đơn hàng PayPal' })
  @ApiBody({ type: CreateOrderDto })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: 'Tạo đơn hàng thành công, trả về URL để approve thanh toán',
    schema: {
      example: {
        statusCode: 200,
        message: 'Tạo đơn hàng thành công',
        data: 'https://www.sandbox.paypal.com/checkoutnow?token=ORDER123456',
      },
    },
  })
  async createOrder(@Body() dto: CreateOrderDto): Promise<ApiResponse<string>> {
    const order: string = await this.paymentService.createOrder(dto); // trả về approvalUrl
    return {
      statusCode: HttpStatus.OK,
      message: PaymentNotifyMessage.CREATE_ORDER_SUCCESSFUL,
      data: order,
    };
  }

  @Get('success')
  @ApiOperation({ summary: 'Capture đơn hàng sau khi người dùng approve' })
  @ApiQuery({ name: 'token', required: true, type: String })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: 'Capture đơn hàng thành công, trả về status',
    schema: {
      example: {
        statusCode: 200,
        message: 'Thanh toán thành công',
        data: 'COMPLETED',
      },
    },
  })
  async capture(
    @Query() dto: CaptureOrderDto,
    @GetUser() payload: JwtPayload,
  ): Promise<ApiResponse<Status>> {
    const result: Order = await this.paymentService.captureOrder(
      dto,
      payload.sub,
    );

    return {
      message: PaymentNotifyMessage.CAPTURE_ORDER_SUCCESSFUL,
      statusCode: HttpStatus.OK,
      data: result.status,
    };
  }
}
