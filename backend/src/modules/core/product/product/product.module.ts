import { ProductController } from '@core-modules/product/product/product.controller';
import { ProductService } from '@core-modules/product/product/product.service';
import { ImageModule } from '@helper-modules/image/image.module';
import { UtilityModule } from '@helper-modules/services/utility.module';
import { StripeModule } from '@helper-modules/stripe/stripe.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [UtilityModule, ImageModule, StripeModule.forRootAsync()],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
