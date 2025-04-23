import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ValidationType } from './interface/config-type.interface';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  private get config(): ValidationType {
    return this.configService.get<ValidationType>('')!;
  }

  get jwtKey(): string {
    return this.config.http.jwtKey;
  }

  get expireTime(): number | string {
    return this.config.http.expireTime;
  }
}
