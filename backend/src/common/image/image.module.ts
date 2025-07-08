import { AppConfigModule } from '@config/app-config.module';
import { Image } from '@images/entites/images.entity';
import { ImageService } from '@images/image.service';
import { ImageRepository } from '@images/repositories/image.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [AppConfigModule, TypeOrmModule.forFeature([Image])],
  providers: [ImageService, ImageRepository],
  exports: [ImageService],
})
export class ImageModule {}
