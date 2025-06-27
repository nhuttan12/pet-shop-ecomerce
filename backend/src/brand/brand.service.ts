import {
  Brand,
  BrandCreateDTO,
  BrandErrorMessages,
  BrandMessagesLog,
  FindBrandById,
  FindBrandByName,
  GetAllBrandsDTO,
} from '@brand';
import { UtilityService } from '@common';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { BrandRepository } from 'brand/repositories/brand.repository';

@Injectable()
export class BrandService {
  private readonly logger = new Logger();
  constructor(
    private utilityService: UtilityService,
    private readonly brandRepo: BrandRepository,
  ) {}

  async getAllBrands({ page, limit }: GetAllBrandsDTO): Promise<Brand[]> {
    const { skip, take } = this.utilityService.getPagination(page, limit);

    this.logger.debug(`Pagination - skip: ${skip}, take: ${take}`);

    return await this.brandRepo.findBrands({}, take, skip);
  }

  async getBrandsById({ id }: FindBrandById): Promise<Brand> {
    const brand: Brand | null = await this.brandRepo.getBrandById(id);
    this.logger.debug(`Brand: ${JSON.stringify(brand)}`);

    if (!brand) {
      throw new InternalServerErrorException(
        BrandErrorMessages.BRAND_NOT_FOUND,
      );
    }

    return brand;
  }

  async findBrandsByName({
    name,
    page,
    limit,
  }: FindBrandByName): Promise<Brand[]> {
    const { skip, take } = this.utilityService.getPagination(page, limit);

    this.logger.debug(`Pagination - skip: ${skip}, take: ${take}`);

    const brands: Brand[] = await this.brandRepo.findBrands(
      {
        name: name,
      },
      take,
      skip,
    );
    this.logger.debug(`Brands by name: ${JSON.stringify(brands)}`);

    return brands;
  }

  async insertBrand(brandDto: BrandCreateDTO): Promise<Brand> {
    try {
      const existBrand = await this.brandRepo.getBrandByName(brandDto.name);

      if (existBrand) {
        this.logger.warn(BrandMessagesLog.BRAND_ALREADY_EXIST);
        throw new InternalServerErrorException(
          BrandErrorMessages.BRAND_ALREADY_EXIST,
        );
      }

      const brand: Brand = await this.brandRepo.insertBrand(brandDto);

      if (!brand) {
        this.logger.error(BrandMessagesLog.BRAND_CREATED_FAILED);
        throw new InternalServerErrorException(
          BrandErrorMessages.BRAND_CREATED_FAILED,
        );
      }

      return brand;
    } catch (error) {
      this.logger.error(`Error inserting brand: ${(error as Error).stack}`);
      throw error;
    } finally {
      this.logger.verbose(`Adding brand ${brandDto.name} successfully`);
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
