import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { UtilityModule } from 'src/helper/services/utility.module';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [UtilityModule, ImageModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
