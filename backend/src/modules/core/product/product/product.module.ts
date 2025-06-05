import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { UtilityModule } from 'src/modules/helper/services/utility.module';
import { ImageModule } from 'src/modules/helper/image/image.module';

@Module({
  imports: [UtilityModule, ImageModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
