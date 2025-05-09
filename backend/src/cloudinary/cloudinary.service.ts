import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { AppConfigService } from 'src/config/app-config.service';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  constructor(private appConfigService: AppConfigService) {}

  getSignedUrl(publicId: string, folder: string) {
    const cloudName = this.appConfigService.cloudName;
    this.logger.debug('Cloud name', cloudName);

    const apiSecret = this.appConfigService.cloudApiKey;
    this.logger.debug('Api secret', apiSecret);

    const timestamp = Math.floor(Date.now() / 1000);
    this.logger.debug('Timestamp', timestamp);

    const paramToSign = {
      publicId,
      folder,
      timestamp,
    };
    this.logger.debug('Param to sign', paramToSign);

    const signature = cloudinary.utils.api_sign_request(paramToSign, apiSecret);
    this.logger.debug('Signature', signature);

    return {
      signedUrl: signature,
      cloudName: cloudName,
      timestamp: timestamp,
    };
  }
}
