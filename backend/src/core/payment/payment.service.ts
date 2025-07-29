import { AppConfigService } from '@config/app-config.service';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { OrderResponseDto } from '@order/dto/order-response.dto';
import { PaymentMethod } from '@order/enums/payment-method.enum';
import { OrderErrorMessage } from '@order/messages/order.error-messages';
import { OrderMessageLog } from '@order/messages/order.message-logs';
import { OrderService } from '@order/order.service';
import { CaptureOrderDto } from '@payment/dto/capture-order.dto';
import { CreateOrderDto } from '@payment/dto/create-order.dto';
import { PaymentErrorMessages } from '@payment/messages/payment.error-messages';
import { PaymentMessageLog } from '@payment/messages/payment.message-logs';
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
import paypalhttp from '@paypal/paypalhttp';
import { UtilityService } from '@services/utility.service';
import { CartService } from '@cart/cart.service';
import { Cart } from '@cart/entities/carts.entity';
import { CartMessageLog } from '@cart/messages/cart.message-logs';
import { CartErrorMessage } from '@cart/messages/cart.error-messages';

@Injectable()
export class PaymentService {
  private readonly client: PayPalHttpClient;
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly cartService: CartService,
    private readonly utilityService: UtilityService,
    private readonly config: AppConfigService,
    private readonly orderService: OrderService,
  ) {
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

    const response = (await this.client.execute(
      request,
    )) as paypalhttp.HttpResponse<Order>;

    const approvalUrl: string | undefined = response.result?.links.find(
      (l: LinkDescription) => l.rel === 'approve',
    )?.href;

    if (!approvalUrl) {
      this.logger.error(PaymentMessageLog.NO_APPROVAL_LINK_FOUND);
      throw new Error(PaymentErrorMessages.PAYMENT_NOT_FOUND);
    }

    return approvalUrl;
  }

  async captureOrder(dto: CaptureOrderDto, userID: number): Promise<Order> {
    // 1. Create payment request
    const request: paypal.orders.OrdersCaptureRequest =
      new paypal.orders.OrdersCaptureRequest(dto.token);
    request.requestBody({} as any);
    this.utilityService.logPretty('Create payment request', request);

    // 2. Create paypal response
    const response = (await this.client.execute(
      request,
    )) as paypalhttp.HttpResponse<Order>;
    this.utilityService.logPretty('Create paypal response', response);

    // 3. Get result from response
    const result: Order | undefined = response.result;
    this.utilityService.logPretty('Get result from response', result);

    // 4. Check result exist
    if (!result) {
      this.logger.error(PaymentMessageLog.CAPTURE_ORDER_FAILED);
      throw new InternalServerErrorException(
        PaymentErrorMessages.CAPTURE_ORDER_FAILED,
      );
    }

    // 5. Get shipping from result
    const shipping = result.purchase_units?.[0]?.shipping;
    this.utilityService.logPretty('Get shipping from result', shipping);

    // 6. Get cart by user ID
    this.logger.verbose('Get cart by user ID');
    const cart: Cart | null = await this.cartService.getCartByUserID(userID);
    this.utilityService.logPretty('Get cart by user ID result', cart);

    // 7. Check if cart exist
    this.logger.verbose('Check if cart exist');
    if (!cart) {
      this.logger.error(CartMessageLog.CART_NOT_FOUND);
      throw new InternalServerErrorException(CartErrorMessage.CART_NOT_FOUND);
    }

    // 8. Create order result
    this.logger.verbose('Create order result');
    const createOrderResult: OrderResponseDto =
      await this.orderService.createOrder(userID, {
        paymentMethod: PaymentMethod.PAYPAL,
        shippingMethod: dto.shippingMethod,
        city: shipping.address.country_code,
        country: shipping?.address?.country_code,
        address: shipping?.address?.address_line_1 || 'No address',
        paypalOrderId: result.id,
        zipCode: shipping?.address?.postal_code || 'Zip code unknown',
      });
    this.utilityService.logPretty('Create order result', createOrderResult);

    // 7. Check create order result
    if (!createOrderResult) {
      this.logger.warn(OrderMessageLog.CREATE_ORDER_FAILED);
      throw new InternalServerErrorException(
        OrderErrorMessage.CREATE_ORDER_FAILED,
      );
    }

    // 8. Return result
    return result;
  }
}
