import { ImageModule } from '@images/image.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRating } from '@product/entites/product-rating.entity';
import { Product } from '@product/entites/products.entity';
import { ProductRatingService } from '@product/product-rating.service';
import { ProductController } from '@product/product.controller';
import { ProductService } from '@product/product.service';
import { UtilityModule } from '@services/utility.module';
import { UsersModule } from '@user/user.module';

@Module({
  imports: [
    UtilityModule,
    ImageModule,
    UsersModule,
    TypeOrmModule.forFeature([Product, ProductRating]),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRatingService],
  exports: [ProductService],
})
export class ProductModule {}
