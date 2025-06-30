import { Category, CategoryController, CategoryService } from '@category';
import { ImageModule, UtilityModule } from '@common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ImageModule, UtilityModule, TypeOrmModule.forFeature([Category])],
  providers: [CategoryService],
  exports: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
