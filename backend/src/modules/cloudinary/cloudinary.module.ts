import { Module } from '@nestjs/common';
// import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryService } from './cloudinary.service';
import { AppConfigModule } from 'src/modules/config/app-config.module';

@Module({
  imports: [AppConfigModule],
  providers: [CloudinaryService],
  exports: [CloudinaryService],
  // controllers: [CloudinaryController],
})
export class CloudinaryModule {}
