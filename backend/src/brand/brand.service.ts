import { BrandCreateDTO } from '@brand/dto/create-brand.dto';
import { FindBrandById } from '@brand/dto/find-brand-by-id.dto';
import { FindBrandByName } from '@brand/dto/find-brand-by-name.dto';
import { GetAllBrandsDTO } from '@brand/dto/get-all-brand.dto';
import { BrandUpdateDTO } from '@brand/dto/update-brand.dto';
import { Brand } from '@brand/entities/brands.entity';
import { BrandErrorMessages } from '@brand/messages/brand.error-messages';
import { BrandMessagesLog } from '@brand/messages/brand.messages-log';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UtilityService } from '@services/utility.service';
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

  async getBrandById({ id }: FindBrandById): Promise<Brand> {
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

  async updateBrand(brandDto: BrandUpdateDTO): Promise<Brand> {
    try {
      await this.brandRepo.updateBrand(brandDto);

      const brand: Brand | null = await this.brandRepo.getBrandById(
        brandDto.id,
      );

      if (!brand) {
        this.logger.error(BrandMessagesLog.BRAND_UPDATED_FAILED);
        throw new InternalServerErrorException(
          BrandErrorMessages.BRAND_UPDATED_FAILED,
        );
      }

      return brand;
    } catch (error) {
      this.logger.error(`Error updating brand: ${(error as Error).stack}`);
      throw error;
    } finally {
      this.logger.verbose(`Updating brand successfully widh ${brandDto.id}`);
    }
  }
}
