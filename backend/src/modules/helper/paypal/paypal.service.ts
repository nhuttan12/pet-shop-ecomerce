import { Injectable } from '@nestjs/common';
import { Client } from '@paypal/paypal-server-sdk';

@Injectable()
export class PaypalService {
  private client: Client;
}
