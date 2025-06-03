import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PaypalTokenResponse } from 'src/helper/dto/paypal/paypal-token-response.dto';
import { AppConfigService } from 'src/modules/config/app-config.service';

@Injectable()
export class PaypalService {
  private clientId: string;
  private clientSecret: string;
  private readonly baseUrl = 'https://api-m.sandbox.paypal.com'; // Đổi sang live nếu cần

  private axios: AxiosInstance;

  constructor(private appConfigService: AppConfigService) {
    this.axios = axios.create({
      baseURL: this.baseUrl,
    });
    this.clientId = appConfigService.clientIdPaypal;
    this.clientSecret = appConfigService.secretPaypal;
  }

  private async getAccessToken(): Promise<string> {
    const credentials = Buffer.from(
      `${this.clientId}:${this.clientSecret}`,
    ).toString('base64');

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    const res = await this.axios.post<PaypalTokenResponse>(
      '/v1/oauth2/token',
      params,
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return res.data.access_token;
  }

  async createOrder(
    amount: string,
    currency: string = 'USD',
  ): Promise<PaypalTokenResponse> {
    const accessToken = await this.getAccessToken();

    const res = await this.axios.post<PaypalTokenResponse>(
      '/v2/checkout/orders',
      {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount,
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return res.data;
  }

  async captureOrder(orderId: string): Promise<PaypalTokenResponse> {
    const accessToken = await this.getAccessToken();

    const res = await this.axios.post<PaypalTokenResponse>(
      `/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return res.data;
  }
}
