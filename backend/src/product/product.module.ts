import { BrandModule } from '@brand/brand.module';
import { CategoryModule } from '@category/category.module';
import { ImageModule } from '@images/image.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRating } from '@product/entites/product-rating.entity';
import { Product } from '@product/entites/products.entity';
import { ProductRatingService } from '@product/product-rating.service';
import { ProductController } from '@product/product.controller';
import { ProductService } from '@product/product.service';
import { ProductRatingRepository } from '@product/repositories/product-rating.repository';
import { ProductRepository } from '@product/repositories/product.repository';
import { UtilityModule } from '@services/utility.module';
import { UsersModule } from '@user/user.module';

@Module({
  imports: [
    UtilityModule,
    ImageModule,
    UsersModule,
    BrandModule,
    CategoryModule,
    TypeOrmModule.forFeature([Product, ProductRating]),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductRatingService,
    ProductRepository,
    ProductRatingRepository,
  ],
  exports: [ProductService, ProductRatingService],
})
export class ProductModule {}
