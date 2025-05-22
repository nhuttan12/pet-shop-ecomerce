import { MySql2Database } from 'drizzle-orm/mysql2';
import { Inject, Injectable } from '@nestjs/common';
import { DrizzleAsyncProvider } from '../database/drizzle.provider';
import { Brand, BrandInsert } from 'src/db/helper/schema-type';
import { BrandCreateDTO } from 'src/helper/dto/brand/create-brand.dto';
import { brands } from 'src/db/schema';

@Injectable()
export class BrandService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private brandInsert: MySql2Database<BrandInsert>,
    @Inject(DrizzleAsyncProvider)
    private brand: MySql2Database<Brand>,
  ) {}

  async insertBrand(brand: BrandCreateDTO) {
    const value: BrandInsert = {
      name: brand.name,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const brandCreatedId: { id: number } = await this.brandInsert.transaction(
      async (tx) => {
        return await tx.insert(brands).values(value).$returningId;
      },
    );
  }
}
