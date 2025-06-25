import {
  CloudinaryConfig,
  NodeMailerConfig,
  PayPalConfig,
  StripeConfig,
} from '@common';

/**
 * @description: configuration info of http config
 * @var host: host for this project, example, localhost,...
 * @var port: port number for this project, example: 3000, 8080, ...
 * @var jwtKey: jwt key to encrypt the token
 * @var expireTime: time for token to survie before they die
 * @var cloudinary: cloudinary configuration information
 */
export interface HttpConfig {
  host: string;
  port: number;
  jwtKey: string;
  expireTime: number | string;
  cloudinary: CloudinaryConfig;
  mail: NodeMailerConfig;
  paypal: PayPalConfig;
  stripe: StripeConfig;
}
