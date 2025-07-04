import { ImageModule, UtilityModule } from '@common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Product,
  ProductController,
  ProductRating,
  ProductRatingService,
  ProductService,
} from '@product';
import { UsersModule } from '@user';

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
