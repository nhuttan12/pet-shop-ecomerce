import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpConfig } from './interface/http.interface';
import { MessageLog } from 'src/helper/message-log';
import { DatabaseConfig } from './interface/database.interface';

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
      throw new Error(MessageLog.DB_CONFIG_NOT_FOUND);
    }
    this.logger.debug('database config information', config);
    return config;
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
}
