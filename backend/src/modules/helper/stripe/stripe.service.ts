import { Inject, Injectable, Logger } from '@nestjs/common';
import { STRIPE_API_KEY } from '@constants';
import Stripe from 'stripe';
import { StripeMessageLog } from '@message/srtipe-message';
import { UpdateStripePriceDto } from '@dtos/stripe/update-price-stripe-request.dto';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);
  constructor(
    @Inject(STRIPE_API_KEY)
    private readonly apiKey: string,
  ) {
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: '2025-02-24.acacia',
    });
  }

  // Get Products
  async getProducts(): Promise<Stripe.Product[]> {
    try {
      const products = await this.stripe.products.list();
      this.logger.log('Products fetched successfully');
      return products.data;
    } catch (error) {
      this.logger.error(
        'Failed to attach payment method',
        (error as Error)?.stack,
      );
      throw error;
    }
  }

  // Get Customers
  async getCustomers() {
    try {
      const customers = await this.stripe.customers.list({});
      this.logger.log('Customers fetched successfully');
      return customers.data;
    } catch (error) {
      this.logger.error(
        'Failed to attach payment method',
        (error as Error)?.stack,
      );
      throw error;
    }
  }

  // Accept Payments (Create Payment Intent)
  async createPaymentIntent(
    amount: number,
    currency: string,
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
      });
      this.logger.log(
        `PaymentIntent created successfully with amount: ${amount} ${currency}`,
      );
      return paymentIntent;
    } catch (error) {
      this.logger.error(
        'Failed to attach payment method',
        (error as Error)?.stack,
      );
      throw error;
    }
  }

  // Subscriptions (Create Subscription)
  async createSubscription(
    customerId: string,
    priceId: string,
  ): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
      });
      this.logger.log(
        `Subscription created successfully for customer ${customerId}`,
      );
      return subscription;
    } catch (error) {
      this.logger.error(
        StripeMessageLog.FAILED_TO_ATTACH_PAYMENT_METHOD,
        (error as Error)?.stack,
      );
      throw error;
    }
  }

  // Customer Management (Create Customer)
  async createCustomer(email: string, name: string): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.create({ email, name });
      this.logger.log(
        `${StripeMessageLog.CUSTOMER_IN_STRIPE_CREATE_SUCCESSFULLY_WITH_EMAIL}: ${email}`,
      );
      return customer;
    } catch (error) {
      this.logger.error(
        'Failed to attach payment method',
        (error as Error)?.stack,
      );
      throw error;
    }
  }

  // Product & Pricing Management (Create Product with Price)
  async createProduct(
    name: string,
    description: string,
  ): Promise<Stripe.Product> {
    try {
      const product = await this.stripe.products.create({ name, description });
      this.logger.log(
        `${StripeMessageLog.PRODUCT_CREATE_SUCCESSFULLY}: ${name}`,
      );
      return product;
    } catch (error) {
      this.logger.error(
        StripeMessageLog.FAILED_TO_ATTACH_PAYMENT_METHOD,
        (error as Error)?.stack,
      );
      throw error;
    }
  }

  async createPrice(
    stripeProductId: string,
    price: number,
    currency: string = 'vnd',
  ): Promise<Stripe.Price> {
    try {
      const stripePrice = await this.stripe.prices.create({
        product: stripeProductId,
        unit_amount: price * 100, // cents
        currency,
      });
      this.logger.log(`Created Stripe price: ${stripePrice.id}`);

      return stripePrice;
    } catch (error) {
      this.logger.error(
        StripeMessageLog.FAILED_TO_ATTACH_PAYMENT_METHOD,
        (error as Error)?.stack,
      );
      throw error;
    }
  }

  // Refunds (Process Refund)
  async refundPayment(paymentIntentId: string): Promise<Stripe.Refund> {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
      });

      this.logger.log(
        StripeMessageLog.REFUND_PROCESS_SUCCESSFULLY_FOR_PAYMENT_INTENT +
          ' ' +
          paymentIntentId,
      );

      return refund;
    } catch (error) {
      this.logger.error(
        StripeMessageLog.FAILED_TO_ATTACH_PAYMENT_METHOD,
        (error as Error)?.stack,
      );
      throw error;
    }
  }

  // Payment Method Integration (Attach Payment Method)
  async attachPaymentMethod(
    customerId: string,
    paymentMethodId: string,
  ): Promise<void> {
    try {
      await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });
      this.logger.log(
        `Payment method ${paymentMethodId} attached to customer ${customerId}`,
      );
    } catch (error) {
      this.logger.error(
        StripeMessageLog.FAILED_TO_ATTACH_PAYMENT_METHOD,
        (error as Error)?.stack,
      );
      throw error;
    }
  }

  // Update product in stripe service
  async updateProduct(
    stripeProductId: string,
    name?: string,
    description?: string,
  ): Promise<Stripe.Product> {
    try {
      const product = await this.stripe.products.update(stripeProductId, {
        name: name,
        description: description,
      });

      this.logger.log(StripeMessageLog.PRODUCT_UPDATE_SUCCESSFULLY);
      return product;
    } catch (error) {
      this.logger.error(
        StripeMessageLog.FAILED_TO_ATTACH_PAYMENT_METHOD,
        (error as Error)?.stack,
      );

      throw error;
    }
  }

  async updatePrice({
    newAmount,
    oldPriceId,
    stripeProductId,
    currency,
    interval,
  }: UpdateStripePriceDto): Promise<Stripe.Price> {
    // 1. Deactivate old price (không thể xóa, chỉ vô hiệu hóa)
    await this.stripe.prices.update(oldPriceId, { active: false });

    // 2. Tạo price mới
    const newPrice = await this.stripe.prices.create({
      unit_amount: newAmount,
      currency,
      product: stripeProductId,
      recurring: {
        interval,
      },
    });

    return newPrice;
  }

  // Reports and Analytics (Retrieve Balance)
  async getBalance(): Promise<Stripe.Balance> {
    try {
      const balance = await this.stripe.balance.retrieve();
      this.logger.log('Balance retrieved successfully');
      return balance;
    } catch (error) {
      this.logger.error(
        StripeMessageLog.FAILED_TO_ATTACH_PAYMENT_METHOD,
        (error as Error)?.stack,
      );
      throw error;
    }
  }

  // Payment Links
  async createPaymentLink(priceId: string): Promise<Stripe.PaymentLink> {
    try {
      const paymentLink = await this.stripe.paymentLinks.create({
        line_items: [{ price: priceId, quantity: 1 }],
      });
      this.logger.log('Payment link created successfully');
      return paymentLink;
    } catch (error) {
      this.logger.error(
        StripeMessageLog.FAILED_TO_ATTACH_PAYMENT_METHOD,
        (error as Error)?.stack,
      );
      throw error;
    }
  }
}
