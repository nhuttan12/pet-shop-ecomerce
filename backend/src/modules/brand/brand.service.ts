import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MySql2Database, MySqlRawQueryResult } from 'drizzle-orm/mysql2';
import { Brand, BrandInsert } from 'src/db/helper/schema-type';
import { brands } from 'src/db/schema';
import { BrandCreateDTO } from 'src/helper/dto/brand/create-brand.dto';
import { ErrorMessage } from 'src/helper/message/error-message';
import { MessageLog } from 'src/helper/message/message-log';
import { DrizzleAsyncProvider } from '../database/drizzle.provider';
import { BrandUpdateDTO } from 'src/helper/dto/brand/update-brand.dto';
import { asc, eq } from 'drizzle-orm';
import { GetAllBrandsDTO } from 'src/helper/dto/brand/get-all-brand.dto';
import { FindBrandById } from 'src/helper/dto/brand/find-brand-by-id.dto';
import { FindBrandByName } from 'src/helper/dto/brand/find-brand-by-name.dto';

@Injectable()
export class BrandService {
  private readonly logger = new Logger();
  constructor(
    @Inject(DrizzleAsyncProvider)
    private brandInsert: MySql2Database<BrandInsert>,
    @Inject(DrizzleAsyncProvider)
    private brandSelect: MySql2Database<Brand>,
  ) {}

  async getAllBrands(brand: GetAllBrandsDTO): Promise<Brand[]> {
    this.logger.debug(
      `Limit and offset for pagination ${brand.limit}, ${brand.page}`,
    );

    let offset: number = brand.page;
    const limit: number = brand.limit;

    offset = offset < 0 ? (offset = 0) : offset - 1;

    const brandList: Brand[] = await this.brandSelect
      .select()
      .from(brands)
      .orderBy(asc(brands.id))
      .limit(limit)
      .offset(offset);

    this.logger.debug(`Brand list ${JSON.stringify(brandList)}`);

    return brandList;
  }

  async findBrandsById(brand: FindBrandById): Promise<Brand[]> {
    this.logger.debug('Id to get brand', brand.id);

    const brandList: Brand[] = await this.brandSelect
      .select()
      .from(brands)
      .where(eq(brands.id, brand.id))
      .orderBy(asc(brands.id));

    this.logger.debug(`Uset getted by id: ${JSON.stringify(brandList)}`);

    return brandList;
  }

  async findBrandsByName(brand: FindBrandByName): Promise<Brand[]> {
    this.logger.debug(`Name to find brand: ${brand.name}`);

    const brandList: Brand[] | undefined = await this.brandSelect
      .select()
      .from(brands)
      .where(eq(brands.name, brand.name))
      .limit(1)
      .execute();

    this.logger.debug(`User finded by name ${JSON.stringify(brandList)}`);

    return brandList;
  }

  async insertBrand(brand: BrandCreateDTO): Promise<number> {
    this.logger.debug(`Brand: ${JSON.stringify(brand)}`);

    const value: BrandInsert = {
      name: brand.name,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.logger.debug(`Value ${JSON.stringify(value)}`);

    const [brandCreatedId]: { id: number }[] =
      await this.brandInsert.transaction(async (tx) => {
        return await tx.insert(brands).values(value).$returningId();
      });

    this.logger.debug(`Brand created id ${brandCreatedId.id}`);

    if (!brandCreatedId) {
      this.logger.error(MessageLog.BRAND_NOT_FOUND);
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    }

    return brandCreatedId.id;
  }

  async updateBrand(brand: BrandUpdateDTO): Promise<void> {
    const value: BrandInsert = {
      name: brand.name,
      updated_at: new Date(),
    };

    const brandId: number = brand.id;

    const result: MySqlRawQueryResult = await this.brandInsert.transaction(
      async (tx) => {
        return await tx.update(brands).set(value).where(eq(brands.id, brandId));
      },
    );

    if (!result) {
      this.logger.error(MessageLog.BRAND_CANNOT_BE_UPDATED);
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
