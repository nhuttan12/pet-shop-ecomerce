import { Injectable } from '@nestjs/common';
import { Client, Environment, LogLevel } from '@paypal/paypal-server-sdk';

@Injectable()
export class PaypalService {
  private client: Client;
  constructor() {
    this.client = new Client({
      clientCredentialsAuthCredentials: {
        oAuthClientId: process.env.PAYPAL_CLIENT_ID || 'YourClientId',
        oAuthClientSecret:
          process.env.PAYPAL_CLIENT_SECRET || 'YourClientSecret',
      },
      environment: Environment.Sandbox, // hoặc Environment.Production
      timeout: 0,
      logging: {
        logLevel: LogLevel.Info,
        logRequest: { logBody: true },
        logResponse: { logHeaders: true },
      },
    });
  }

  getClient(): Client {
    return this.client;
  }

  // async createOrder(amount: string): Promise<Order> {
  //   try {
  //     const request = new OrdersCreateRequest();

  //     const orderRequest = {
  //       intent: 'CAPTURE',
  //       purchase_units: [
  //         {
  //           amount: {
  //             currency_code: 'USD',
  //             value: amount,
  //           },
  //         },
  //       ],
  //     };

  //     const response = await this.client.orders.create(orderRequest);
  //     return response.result as Order;
  //   } catch (error) {
  //     // Bạn có thể log lỗi hoặc xử lý tùy ý
  //     console.error('Error creating PayPal order:', error);
  //     return null;
  //   }
  // }
}
