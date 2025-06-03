import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotAcceptableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessageLog } from 'src/helper/message/message-log';
import { ErrorMessage } from 'src/helper/message/error-message';
import { HttpConfig } from 'src/helper/interface/http.interface';
import { DatabaseConfig } from 'src/helper/interface/database.interface';
import { CloudinaryConfig } from 'src/helper/interface/cloudinary.interface';
import { NodeMailerConfig } from 'src/helper/interface/nodemailer.interface';
import { DomainValidation } from 'src/helper/interface/domain.interface';
import { PayPalConfig } from 'src/helper/interface/paypal.interface';

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

  private get getDatabaseConfig(): DatabaseConfig {
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
      this.logger.error(MessageLog.DOMAIN_CONFIG_NOT_FOUND);
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
      this.logger.error(MessageLog.CLOUINARY_NAME_NOT_FOUND);
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
      this.logger.error(MessageLog.CLOUINARY_API_KEY_NOT_FOUND);
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
      this.logger.error(MessageLog.EMAIL_IS_NOT_FOUND);
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
      this.logger.error(MessageLog.APP_PASSWORD_IS_NOT_FOUND);
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
      this.logger.error(MessageLog.CLIENT_ID_PAYPAL_NOT_FOUND);
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    }

    return clientId;
  }

  get secretPaypal(): string {
    const secret = this.getPaypalConfig.secret;

    if (!secret) {
      this.logger.error(MessageLog.SECRET_PAYPAL_NOT_FOUND);
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    }

    return secret;
  }

  get environmentPaypal(): string {
    const environment = this.getPaypalConfig.environtment;

    if (!environment) {
      this.logger.error(MessageLog.ENVIRONMENT_PAYPAL_NOT_FOUND);
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    }

    return environment;
  }
}
