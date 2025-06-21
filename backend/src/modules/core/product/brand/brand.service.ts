import { BrandCreateDTO } from '@dtos/brand/create-brand.dto';
import { FindBrandById } from '@dtos/brand/find-brand-by-id.dto';
import { FindBrandByName } from '@dtos/brand/find-brand-by-name.dto';
import { GetAllBrandsDTO } from '@dtos/brand/get-all-brand.dto';
import { BrandUpdateDTO } from '@dtos/brand/update-brand.dto';
import { BrandStatus } from '@enum/status/brand-status.enum';
import { DrizzleAsyncProvider } from '@helper-modules/database/drizzle.provider';
import { SearchService } from '@helper-modules/services/search.service';
import { UtilityService } from '@helper-modules/services/utility.service';
import { ErrorMessage } from '@message/error-message';
import { MessageLog } from '@message/message-log';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { brands } from '@schema';
import { Brand, BrandInsert } from '@schema-type';
import { eq, like } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

@Injectable()
export class BrandService {
  private readonly logger = new Logger();
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: MySql2Database<any>,
    private searchService: SearchService,
    private utilityService: UtilityService,
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
    const { skip, take } = this.utilityService.getPagination(page, limit);

    this.logger.debug(`Pagination - skip: ${skip}, take: ${take}`);

    return await this.searchService.findManyOrReturnEmptyArray<Brand, any>(
      this.db,
      brands,
      undefined,
      take,
      skip,
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
    const { skip, take } = this.utilityService.getPagination(page, limit);

    this.logger.debug(`Pagination - skip: ${skip}, take: ${take}`);
    return await this.searchService.findManyOrReturnEmptyArray(
      this.db,
      brands,
      like(brands.name, `%${name}%`),
      take,
      skip,
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
