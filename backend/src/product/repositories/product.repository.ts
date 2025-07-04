import { Brand } from '@brand';
import { ErrorMessage } from '@common';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  Product,
  ProductErrorMessage,
  ProductFilterParams,
  ProductMessageLog,
  ProductStatus,
} from '@product';
import { DataSource, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ProductRepository {
  private readonly logger = new Logger(ProductRepository.name);
  constructor(
    private readonly productRepo: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}

  async getProductById(productID: number): Promise<Product | null> {
    return await this.productRepo.findOneBy({ id: productID });
  }

  async createProduct(
    name: string,
    description: string,
    price: number,
    brand: Brand,
    quantity: number,
    discount: number,
  ): Promise<Product> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const product: Product = manager.create(Product, {
          name,
          description,
          price,
          brand,
          status: ProductStatus.ACTIVE,
          stocking: quantity,
          discount,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return await manager.save(product);
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getAllProductWithImageAndCategory(
    skip: number,
    take: number,
  ): Promise<Product[]> {
    try {
      return await this.productRepo
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.brand', 'brand')
        .leftJoinAndSelect('product.categoriesMapping', 'categoryMapping')
        .leftJoinAndSelect('categoryMapping.category', 'category')
        .skip(skip)
        .take(take)
        .getMany();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findProductByName(
    name: string,
    skip: number,
    take: number,
  ): Promise<Product[]> {
    try {
      return await this.productRepo
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.brand', 'brand')
        .leftJoinAndSelect('product.categoriesMapping', 'categoryMapping')
        .leftJoinAndSelect('categoryMapping.category', 'category')
        .where('product.name LIKE :name', { name: `%${name}%` })
        .orderBy('product.id', 'ASC')
        .skip(skip)
        .take(take)
        .getMany();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateProduct(
    id: number,
    name: string,
    description: string,
    price: number,
    brand: Brand,
    status: ProductStatus,
    quantity: number,
  ): Promise<boolean> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const result = await manager.update(Product, id, {
          name,
          description,
          price,
          brand,
          status,
          stocking: quantity,
          updatedAt: new Date(),
        });

        if (result.affected === 0) {
          this.logger.error(ProductMessageLog.PRODUCT_UPDATED_FAILED);
          throw new InternalServerErrorException(
            ErrorMessage.INTERNAL_SERVER_ERROR,
          );
        }

        return true;
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async removeProduct(productID: number): Promise<boolean> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const result: UpdateResult = await manager.update(Product, productID, {
          status: ProductStatus.REMOVED,
          updatedAt: new Date(),
        });

        if (result.affected === 0) {
          this.logger.error(ProductMessageLog.REMOVE_PRODUCT_FAILED);
          throw new InternalServerErrorException(
            ProductErrorMessage.REMOVE_PRODUCT_FAILED,
          );
        }

        return true;
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getProductDetail(
    productID: number,
    skip: number,
    take: number,
  ): Promise<Product | null> {
    try {
      return await this.productRepo
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.brand', 'brand')
        .leftJoinAndSelect('product.productRating', 'productRating')
        .leftJoinAndSelect('product.categoriesMapping', 'categoryMapping')
        .leftJoinAndSelect('categoryMapping.category', 'category')
        .where('product.id = :id', { id: productID })
        .skip(skip)
        .take(take)
        .orderBy('product.id', 'ASC')
        .getOne();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async filterProducts(
    request: ProductFilterParams,
    skip: number,
    take: number,
  ): Promise<Product[]> {
    try {
      const query = this.productRepo
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.brand', 'brand')
        .leftJoinAndSelect('product.categoriesMapping', 'categoryMapping')
        .leftJoinAndSelect('categoryMapping.category', 'category');

      if (request.name) {
        query.andWhere('LOWER(product.name) LIKE :name', {
          name: `%${request.name.trim().toLowerCase()}%`,
        });
      }

      if (request.brandName) {
        query.andWhere('LOWER(brand.name) LIKE :brandName', {
          brandName: `%${request.brandName.trim().toLowerCase()}%`,
        });
      }

      if (request.category) {
        query.andWhere('LOWER(category.name) = :categoryName', {
          categoryName: request.category.trim().toLowerCase(),
        });
      }

      if (request.minPrice) {
        query.andWhere('product.price >= :minPrice', {
          minPrice: request.minPrice,
        });
      }

      if (request.maxPrice) {
        query.andWhere('product.price <= :maxPrice', {
          maxPrice: request.maxPrice,
        });
      }

      if (request.status) {
        query.andWhere('product.status = :status', { status: request.status });
      }

      if (request.stocking !== undefined) {
        query.andWhere('product.stocking = :stocking', {
          stocking: request.stocking,
        });
      }

      if (request.discount !== undefined) {
        query.andWhere('product.discount = :discount', {
          discount: request.discount,
        });
      }

      query.orderBy(
        'product.price',
        request.sortOrder === 'asc' ? 'ASC' : 'DESC',
      );

      return await query.skip(skip).take(take).getMany();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
