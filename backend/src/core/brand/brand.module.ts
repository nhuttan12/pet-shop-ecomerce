import { BrandController } from '@brand/brand.controller';
import { BrandService } from '@brand/brand.service';
import { Brand } from '@brand/entities/brands.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilityModule } from '@services/utility.module';
import { BrandRepository } from '@brand/repositories/brand.repository';

@Module({
  imports: [UtilityModule, TypeOrmModule.forFeature([Brand])],
  controllers: [BrandController],
  providers: [BrandService, BrandRepository],
  exports: [BrandService],
})
export class BrandModule {}
