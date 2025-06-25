import { AppConfigModule, Image, ImageService } from '@common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [AppConfigModule, TypeOrmModule.forFeature([Image])],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
