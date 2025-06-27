import {
  Brand,
  BrandCreateDTO,
  BrandErrorMessages,
  BrandMessagesLog,
  BrandStatus,
  BrandUpdateDTO,
} from '@brand';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class BrandRepository {
  private readonly logger = new Logger(BrandRepository.name);
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
    private readonly dataSource: DataSource,
  ) {}

  async getBrandById(id: number): Promise<Brand | null> {
    return this.brandRepo.findOne({ where: { id } });
  }

  async getBrandByName(name: string): Promise<Brand | null> {
    return this.brandRepo.findOne({ where: { name } });
  }

  async findBrands(
    filters: Partial<{
      name?: string;
      fromDate?: Date;
      toDate?: Date;
      status?: BrandStatus;
    }>,
    take?: number,
    skip?: number,
    sortField: keyof Brand = 'id',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<Brand[]> {
    const qb = this.brandRepo.createQueryBuilder('brand');

    if (filters.name) {
      qb.andWhere('brand.name LIKE :name', { name: `%${filters.name}%` });
    }

    if (filters.status !== undefined) {
      qb.andWhere('brand.status = :status', { status: filters.status });
    }

    if (filters.fromDate) {
      qb.andWhere('brand.createdAt >= :fromDate', {
        fromDate: filters.fromDate,
      });
    }

    if (filters.toDate) {
      qb.andWhere('brand.createdAt <= :toDate', { toDate: filters.toDate });
    }

    qb.orderBy(`brand.${sortField}`, sortOrder);

    if (take !== undefined) {
      qb.take(take);
    }

    if (skip !== undefined) {
      qb.skip(skip);
    }

    return qb.getMany();
  }

  async insertBrand(brandDto: BrandCreateDTO): Promise<Brand> {
    return await this.dataSource.transaction(async (manager) => {
      const brand = manager.create(Brand, {
        name: brandDto.name,
        status: BrandStatus.ACTIVE,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const savedBrand = await manager.save(brand);

      if (!savedBrand?.id) {
        this.logger.error(BrandMessagesLog.BRAND_CREATED_FAILED);
        throw new NotFoundException(BrandErrorMessages.BRAND_NOT_FOUND);
      }

      this.logger.debug(`Brand created id: ${savedBrand.id}`);

      return savedBrand;
    });
  }

  async updateBrand(brand: BrandUpdateDTO): Promise<void> {
    return await this.dataSource.transaction(async (manager) => {
      await manager.update(Brand, brand.id, {
        name: brand.name,
        status: brand.status,
        updatedAt: new Date(),
      });
    });
  }
}
