import { Controller, Get, Inject } from '@nestjs/common';
import * as cloudinary from 'cloudinary';

@Controller('cloudinary')
export class CloudinaryController {
  @Get('signed-url')
  async getSignedUrl() {
  }
}
