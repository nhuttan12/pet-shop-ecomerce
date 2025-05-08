import { Inject, Injectable, Logger } from '@nestjs/common';
import { CloudinaryProviderToken } from './cloudinary/cloudinary.provider';
import { v2 as cloudinaryType } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  constructor(
    @Inject(CloudinaryProviderToken)
    private readonly cloudinary: typeof cloudinaryType,
    private configService: ConfigService,
  ) {}
  // async uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
  //   return new Promise<CloudinaryResponse>((resolve, reject) => {
  //     const uploadStream = cloudinary.uploader.upload_stream(
  //       (
  //         error: UploadApiErrorResponse | null,
  //         result: UploadApiResponse | null,
  //       ) => {
  //         if (error) {
  //           this.logger.error(error.message);
  //           return reject(
  //             new InternalServerErrorException(
  //               ErrorMessage.INTERNAL_SERVER_ERROR,
  //             ),
  //           );
  //         }

  //         if (!result) {
  //           this.logger.error(MessageLog.NO_RESULT_FROM_CLOUDINARY);
  //           return reject(
  //             new InternalServerErrorException(
  //               ErrorMessage.INTERNAL_SERVER_ERROR,
  //             ),
  //           );
  //         }

  //         resolve(result);
  //       },
  //     );

  //     streamifier.createReadStream(file.buffer).pipe(uploadStream);
  //   });
  // }

  async getSignedUrl() {
    const cloudName = this.configService.get<string>('http.cloudinary.name');
    const api_secret = this.configService.get<string>(
      'http.cloudinary.api_secret',
    );
    const timestamp = Math.floor(Date.now() / 1000);

    const signature = this.cloudinary.utils.api_sign_request(
      {
        folder: cloudName,
        timestamp: timestamp,
      },
      api_secret,
    );

    return {
      signedUrl: signature,
      cloudName: cloudName,
      timestamp: timestamp,
    };
  }
}
