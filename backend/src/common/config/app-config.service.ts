import { ErrorMessage } from '@messages/error.messages';
import { MessageLog } from '@messages/log.messages';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotAcceptableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudinaryConfig } from './interfaces/cloudinary.interface';
import { DatabaseConfig } from './interfaces/database.interface';
import { DomainValidation } from './interfaces/domain.interface';
import { HttpConfig } from './interfaces/http.interface';
import { NodeMailerConfig } from './interfaces/nodemailer.interface';
import { PayPalConfig } from './interfaces/paypal.interface';
import { EmailConfigErrorMessage } from '@config/messages/email-config.error-messages';
import { CloudinaryConfigErrorMessage } from '@config/messages/cloudinary-config.error-messages';
import { PaypalConfigErrorMessage } from '@config/messages/paypal-config.error-messages';

@Injectable()
export class AppConfigService {
  private readonly logger = new Logger(AppConfigService.name);
  constructor(private configService: ConfigService) {}

  private get getHttpConfig(): HttpConfig {
    const config = this.configService.get<HttpConfig>('http');
    if (!config) {
      this.logger.error(MessageLog.HTTP_CONFIG_NOT_FOUND);
      throw new Error(MessageLog.HTTP_CONFIG_NOT_FOUND);
    }
    this.logger.debug('http config information', config);
    return config;
  }

  get getDatabaseConfig(): DatabaseConfig {
    const config = this.configService.get<DatabaseConfig>('db');
    if (!config) {
      this.logger.error(MessageLog.DB_CONFIG_NOT_FOUND);
      throw new Error(ErrorMessage.DB_CONFIG_NOT_FOUND);
    }
    this.logger.debug('database config information', config);
    return config;
  }

  get domainConfig(): DomainValidation {
    const config = this.configService.get<DomainValidation>('domain');

    if (!config) {
      this.logger.error(EmailConfigErrorMessage.DOMAIN_CONFIG_NOT_FOUND);
      throw new NotAcceptableException(ErrorMessage.DOMAIN_CONFIG_NOT_FOUND);
    }

    this.logger.debug('Config info', config);
    return config;
  }

  private get getCloudinaryConfig(): CloudinaryConfig {
    return this.getHttpConfig.cloudinary;
  }

  private get getNodeMailerConfig(): NodeMailerConfig {
    return this.getHttpConfig.mail;
  }

  private get getPaypalConfig(): PayPalConfig {
    return this.getHttpConfig.paypal;
  }

  get jwtKey(): string {
    const config = this.getHttpConfig;
    const jwtKey = config.jwtKey;
    this.logger.debug('jwt key information', jwtKey);
    if (!jwtKey) {
      this.logger.error(MessageLog.JWT_KEY_NOT_FOUND);
    }
    return jwtKey;
  }

  get expireTime(): number | string {
    const config = this.getHttpConfig;
    const expireTime = config.expireTime;
    this.logger.debug('expire time information', expireTime);
    if (!expireTime) {
      this.logger.error(MessageLog.EXPIRE_TIME_NOT_FOUND);
    }
    return expireTime;
  }

  get cloudName(): string {
    const cloudName = this.getCloudinaryConfig.name;

    if (!cloudName) {
      this.logger.error(CloudinaryConfigErrorMessage.CLOUINARY_NAME_NOT_FOUND);
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    }

    this.logger.debug('Cloud name', cloudName);
    return cloudName;
  }

  get cloudApiKey(): string {
    const apiKey = this.getCloudinaryConfig.api_key;

    if (!apiKey) {
      this.logger.error(
        CloudinaryConfigErrorMessage.CLOUINARY_API_KEY_NOT_FOUND,
      );
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    }

    this.logger.debug('Api key', apiKey);
    return apiKey;
  }

  get email(): string {
    const mail = this.getNodeMailerConfig.email;

    if (!mail) {
      this.logger.error(EmailConfigErrorMessage.EMAIL_IS_NOT_FOUND);
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    }

    this.logger.debug('Email', mail);
    return mail;
  }

  get appPassword(): string {
    const appPassword = this.getNodeMailerConfig.app_password;

    if (!appPassword) {
      this.logger.error(EmailConfigErrorMessage.APP_PASSWORD_IS_NOT_FOUND);
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    }

    this.logger.debug('App password', appPassword);
    return appPassword;
  }

  get clientIdPaypal(): string {
    const clientId = this.getPaypalConfig.client_id;

    if (!clientId) {
      this.logger.error(PaypalConfigErrorMessage.CLIENT_ID_PAYPAL_NOT_FOUND);
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    }

    return clientId;
  }

  get secretPaypal(): string {
    const secret = this.getPaypalConfig.secret;

    if (!secret) {
      this.logger.error(PaypalConfigErrorMessage.SECRET_PAYPAL_NOT_FOUND);
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    }

    return secret;
  }

  get environmentPaypal(): string {
    const environment = this.getPaypalConfig.environment;

    if (!environment) {
      this.logger.error(PaypalConfigErrorMessage.ENVIRONMENT_PAYPAL_NOT_FOUND);
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    }

    return environment;
  }

  get returnUrlPaypal(): string {
    const returnUrl = this.getPaypalConfig.return_url;

    if (!returnUrl) {
      this.logger.error(PaypalConfigErrorMessage.RETURN_URL_REQUIRED);
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    }

    return returnUrl;
  }

  get cancelUrlPaypal(): string {
    const cancelUrl = this.getPaypalConfig.cancel_url;

    if (!cancelUrl) {
      this.logger.error(PaypalConfigErrorMessage.CANCEL_URL_REQUIRED);
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    }

    return cancelUrl;
  }
}
