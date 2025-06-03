import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { CreateOrderDto } from 'src/helper/dto/paypal/create-order-paypal-request.dto';
import { CaptureOrderDto } from 'src/helper/dto/paypal/capture-order-paypal-request.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/helper/guard/jwt-auth.guard';
import { RolesGuard } from 'src/helper/guard/roles.guard';
import { HasRole } from 'src/helper/decorator/roles.decorator';
import { Role } from 'src/helper/enum/role.enum';
import { PaypalTokenResponse } from 'src/helper/dto/paypal/paypal-token-response.dto';
import { ApiResponse } from 'src/helper/dto/response/ApiResponse/ApiResponse';
import { NotifyMessage } from 'src/helper/message/notify-message';

@Controller('paypal')
@ApiTags('Paypal')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard, RolesGuard)
@HasRole(Role.ADMIN)
export class PaypalController {
  constructor(private readonly paypalService: PaypalService) {}

  @Post('create-order')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: CreateOrderDto })
  @ApiOkResponse({ type: ApiResponse<PaypalTokenResponse> })
  async createOrder(
    @Body() body: CreateOrderDto,
  ): Promise<ApiResponse<PaypalTokenResponse>> {
    const orderPaypal = await this.paypalService.createOrder(`${body.amount}`);
    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.CREATE_ORDER_PAYPAL_SUCCESSFUL,
      data: orderPaypal,
    };
  }

  @Post('capture/:orderId')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: CaptureOrderDto })
  @ApiOkResponse({ type: ApiResponse<PaypalTokenResponse> })
  async captureOrder(
    @Param() params: CaptureOrderDto,
  ): Promise<ApiResponse<PaypalTokenResponse>> {
    const capturedOrder = await this.paypalService.captureOrder(
      `${params.orderId}`,
    );
    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.CAPTURE_ORDER_PAYPAL_SUCCESSFUL,
      data: capturedOrder,
    };
  }
}
