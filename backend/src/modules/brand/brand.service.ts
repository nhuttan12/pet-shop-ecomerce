import {
  HttpStatus,
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
import { ApiResponse } from 'src/helper/dto/response/ApiResponse/ApiResponse';
import { NotifyMessage } from 'src/helper/message/notify-message';

@Injectable()
export class BrandService {
  private readonly logger = new Logger();
  constructor(
    @Inject(DrizzleAsyncProvider)
    private brandInsert: MySql2Database<BrandInsert>,
    @Inject(DrizzleAsyncProvider)
    private brandSelect: MySql2Database<Brand>,
  ) {}

  async getAllBrands(brand: GetAllBrandsDTO): Promise<ApiResponse<Brand[]>> {
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

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_ALL_BRAND_SUCCESSFUL,
      data: brandList,
    };
  }

  async findBrandsById(brand: FindBrandById): Promise<ApiResponse<Brand[]>> {
    this.logger.debug('Id to get brand', brand.id);

    const brandList: Brand[] = await this.brandSelect
      .select()
      .from(brands)
      .where(eq(brands.id, brand.id))
      .orderBy(asc(brands.id));

    this.logger.debug(`Uset getted by id: ${JSON.stringify(brandList)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_BRAND_SUCCESSFUL,
      data: brandList,
    };
  }

  async findBrandsByName(
    brand: FindBrandByName,
  ): Promise<ApiResponse<Brand[]>> {
    this.logger.debug(`Name to find brand: ${brand.name}`);

    const brandList: Brand[] | undefined = await this.brandSelect
      .select()
      .from(brands)
      .where(eq(brands.name, brand.name))
      .limit(1)
      .execute();

    this.logger.debug(`User finded by name ${JSON.stringify(brandList)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_BRAND_SUCCESSFUL,
      data: brandList,
    };
  }

  async insertBrand(brand: BrandCreateDTO): Promise<ApiResponse<Brand>> {
    try {
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

      const [newBrand]: Brand[] = await this.brandSelect
        .select()
        .from(brands)
        .where(eq(brands.id, brandCreatedId.id));
      this.logger.debug(`Get new brand from db ${JSON.stringify(newBrand)}`);

      return {
        statusCode: HttpStatus.OK,
        message: NotifyMessage.BRAND_INSERT_SUCCESSFUL,
        data: newBrand,
      };
    } catch (error) {
      this.logger.error(`Error: ${error}`);
      throw error;
    } finally {
      this.logger.verbose(`Adding brand ${brand.name} successfully`);
    }
  }

  async updateBrand(brand: BrandUpdateDTO): Promise<ApiResponse<Brand>> {
    const value: BrandInsert = {
      name: brand.name,
      updated_at: new Date(),
    };
    this.logger.debug(`Value to update ${JSON.stringify(value)}`);

    const brandId: number = brand.id;
    this.logger.debug(`Get brand id ${brandId}`);

    const result: MySqlRawQueryResult = await this.brandInsert.transaction(
      async (tx) => {
        return await tx.update(brands).set(value).where(eq(brands.id, brandId));
      },
    );
    this.logger.verbose(`Update result ${JSON.stringify(result)}`);

    if (!result) {
      this.logger.error(MessageLog.BRAND_CANNOT_BE_UPDATED);
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    }

    const [newBrand]: Brand[] = await this.brandSelect
      .select()
      .from(brands)
      .where(eq(brands.id, brand.id));
    this.logger.debug(`Get new brand from db ${JSON.stringify(newBrand)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.UPDATE_BRAND_SUCCESSFUL,
      data: newBrand,
    };
  }
}
