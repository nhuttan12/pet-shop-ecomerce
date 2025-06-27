import { BrandController, BrandService } from '@brand';
import { UtilityModule } from '@common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from 'brand/entities';
import { BrandRepository } from 'brand/repositories/brand.repository';

@Module({
  imports: [UtilityModule, TypeOrmModule.forFeature([Brand])],
  controllers: [BrandController],
  providers: [BrandService, BrandRepository],
})
export class BrandModule {}
