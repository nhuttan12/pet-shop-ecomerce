import { Module } from '@nestjs/common';
import { ProductRatingService } from './product-rating.service';
import { ProductModule } from '@core-modules/product/product/product.module';
import { UtilityModule } from '@helper-modules/services/utility.module';
import { UsersModule } from '@core-modules/user/user.module';
import { ProductRatingController } from '@core-modules/product/product-rating/product-rating.controller';

@Module({
  imports: [ProductModule, UtilityModule, UsersModule],
  providers: [ProductRatingService],
  controllers: [ProductRatingController],
})
export class ProductRatingModule {}
