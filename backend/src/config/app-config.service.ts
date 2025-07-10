import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ValidationType } from './interface/config-type.interface';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get config(): ValidationType {
    return this.configService.get<ValidationType>('')!;
  }

  get port() {
    return this.config.http.port;
  }

  get host() {
    return this.config.http.host;
  }
}
