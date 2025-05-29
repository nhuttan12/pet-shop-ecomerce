import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { eq, like } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { Brand, BrandInsert } from 'src/db/helper/schema-type';
import { brands } from 'src/db/schema';
import { BrandCreateDTO } from 'src/helper/dto/brand/create-brand.dto';
import { FindBrandById } from 'src/helper/dto/brand/find-brand-by-id.dto';
import { FindBrandByName } from 'src/helper/dto/brand/find-brand-by-name.dto';
import { GetAllBrandsDTO } from 'src/helper/dto/brand/get-all-brand.dto';
import { BrandUpdateDTO } from 'src/helper/dto/brand/update-brand.dto';
import { BrandStatus } from 'src/helper/enum/status/brand-status.enum';
import { ErrorMessage } from 'src/helper/message/error-message';
import { MessageLog } from 'src/helper/message/message-log';
import { SearchService } from 'src/helper/services/search.service';
import { DrizzleAsyncProvider } from '../database/drizzle.provider';

@Injectable()
export class BrandService {
  private readonly logger = new Logger();
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: MySql2Database<any>,
    private searchService: SearchService,
  ) {}

  private async findBrandByIdInternal(id: number): Promise<Brand | null> {
    const result = await this.db
      .select()
      .from(brands)
      .where(eq(brands.id, id))
      .limit(1);
    return result[0] || null;
  }

  async getAllBrands({ page, limit }: GetAllBrandsDTO): Promise<Brand[]> {
    const offset = Math.max(0, page - 1);
    this.logger.debug(`Pagination - limit: ${limit}, offset: ${offset}`);

    return await this.searchService.findManyOrReturnEmptyArray<Brand, any>(
      this.db,
      brands,
      undefined,
      limit,
      offset,
    );
  }

  async getBrandsById({ id }: FindBrandById): Promise<Brand> {
    return await this.searchService.findOneOrThrow<Brand>(
      this.db,
      brands,
      eq(brands.id, id),
      ErrorMessage.BRAND_NOT_FOUND,
    );
  }

  async findBrandsByName({
    name,
    page,
    limit,
  }: FindBrandByName): Promise<Brand[]> {
    const offset = Math.max(0, page - 1);
    this.logger.debug(`Pagination - limit: ${limit}, offset: ${offset}`);
    return await this.searchService.findManyOrReturnEmptyArray(
      this.db,
      brands,
      like(brands.name, `%${name}%`),
      limit,
      offset,
    );
  }

  async insertBrand({ name }: BrandCreateDTO): Promise<Brand> {
    try {
      const value: BrandInsert = {
        name,
        status: BrandStatus.ACTIVE,
        created_at: new Date(),
        updated_at: new Date(),
      };
      this.logger.debug(`Value ${JSON.stringify(value)}`);

      const [inserted]: { id: number }[] = await this.db.transaction((tx) =>
        tx.insert(brands).values(value).$returningId(),
      );

      if (!inserted?.id)
        throw new InternalServerErrorException(
          ErrorMessage.INTERNAL_SERVER_ERROR,
        );

      return await this.searchService.findOneOrThrow<Brand>(
        this.db,
        brands,
        eq(brands.id, inserted.id),
        ErrorMessage.BRAND_NOT_FOUND,
      );
    } catch (error) {
      this.logger.error(`Error inserting brand: ${error}`);
      throw error;
    } finally {
      this.logger.verbose(`Adding brand ${name} successfully`);
    }
  }

  async updateBrand({ id, name, status }: BrandUpdateDTO): Promise<Brand> {
    const value: BrandInsert = {
      name,
      status,
      updated_at: new Date(),
    };
    this.logger.debug(`Value to update ${JSON.stringify(value)}`);

    const result = await this.db.transaction((tx) =>
      tx.update(brands).set(value).where(eq(brands.id, id)),
    );
    this.logger.verbose(`Update result ${JSON.stringify(result)}`);

    if (!result) {
      this.logger.error(MessageLog.BRAND_CANNOT_BE_UPDATED);
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    }

    return await this.searchService.findOneOrThrow<Brand>(
      this.db,
      brands,
      eq(brands.id, id),
      ErrorMessage.BRAND_NOT_FOUND,
    );
  }
}
