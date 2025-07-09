import { AppConfigService } from '@config/app-config.service';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateOrderDto } from '@payment/dto/create-order.dto';
import { PaymentErrorMessages } from '@payment/messages/payment.error-messages';
import { PaymentMessageLog } from '@payment/messages/payment.message-logs';
import { PayPalHttpResponse } from '@payment/type/paypal-http-response.type';
import paypal from '@paypal/checkout-server-sdk';
import {
  LiveEnvironment,
  SandboxEnvironment,
} from '@paypal/checkout-server-sdk/lib/core/paypal_environment';
import { PayPalHttpClient } from '@paypal/checkout-server-sdk/lib/core/paypal_http_client';
import {
  Order,
  OrdersCreateRequest,
} from '@paypal/checkout-server-sdk/lib/orders/lib';
import { LinkDescription } from '@paypal/checkout-server-sdk/lib/payments/lib';

@Injectable()
export class PaymentService {
  private readonly client: PayPalHttpClient;
  private readonly logger = new Logger(PaymentService.name);

  constructor(private readonly config: AppConfigService) {
    const environment: SandboxEnvironment | LiveEnvironment =
      config.environmentPaypal === 'sandbox'
        ? new SandboxEnvironment(config.clientIdPaypal, config.secretPaypal)
        : new LiveEnvironment(config.clientIdPaypal, config.secretPaypal);

    this.client = new PayPalHttpClient(environment);
  }

  async createOrder(dto: CreateOrderDto): Promise<string> {
    const request: OrdersCreateRequest = new OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: dto.currency,
            value: dto.amount.toFixed(2),
          },
          description: dto.description ?? 'Quick order',
        },
      ],
      application_context: {
        return_url: dto.return_url,
        cancel_url: dto.cancel_url,
      },
    });

    const response: PayPalHttpResponse<Order> =
      await this.client.execute(request);

    const approvalUrl: string | undefined = response.result?.links.find(
      (l: LinkDescription) => l.rel === 'approve',
    )?.href;

    if (!approvalUrl) {
      this.logger.error(PaymentMessageLog.NO_APPROVAL_LINK_FOUND);
      throw new Error(PaymentErrorMessages.PAYMENT_NOT_FOUND);
    }

    return approvalUrl;
  }

  async captureOrder(orderID: string): Promise<Order> {
    const request: paypal.orders.OrdersCaptureRequest =
      new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({} as any);

    const response: PayPalHttpResponse<Order> =
      await this.client.execute(request);

    const result: Order | undefined = response.result;

    if (!result) {
      this.logger.error(PaymentMessageLog.CAPTURE_ORDER_FAILED);
      throw new InternalServerErrorException(
        PaymentErrorMessages.CAPTURE_ORDER_FAILED,
      );
    }

    return result;
  }
}
