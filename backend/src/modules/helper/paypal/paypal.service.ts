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
}
