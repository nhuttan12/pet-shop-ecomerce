import { AppConfigModule } from '@helper-modules/config/app-config.module';
import { ImageService } from '@helper-modules/image/image.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [AppConfigModule],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
