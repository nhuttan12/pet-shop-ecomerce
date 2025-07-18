import { Brand } from '@brand/entities/brands.entity';
import { ErrorMessage } from '@messages/error.messages';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { buildPaginationMeta } from '@pagination/build-pagination-meta';
import { PaginationResponse } from '@pagination/pagination-response';
import { ProductFilterParams } from '@product/dto/filter-product-request.dto';
import { Product } from '@product/entites/products.entity';
import { ProductStatus } from '@product/enums/product-status.enum';
import { ProductErrorMessage } from '@product/messages/product.error-messages';
import { ProductMessageLog } from '@product/messages/product.messages-log';
import { DataSource, EntityManager, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ProductRepository {
  private readonly logger = new Logger(ProductRepository.name);
  constructor(
    @InjectRepository(Product)
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
      return await this.dataSource.transaction(
        async (manager: EntityManager) => {
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
        },
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getAllProductWithImageAndCategory(
    skip: number,
    take: number,
    userID?: number,
  ): Promise<PaginationResponse<Product>> {
    try {
      // 1. Get product list join with brand and category
      const query = this.productRepo
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.brand', 'brand')
        .leftJoinAndSelect('product.categoriesMapping', 'categoriesMapping')
        .leftJoinAndSelect('categoriesMapping.category', 'category');

      if (userID) {
        query
          .leftJoinAndSelect('product.wishlistMappings', 'wishlistMapping')
          .leftJoinAndSelect('wishlistMapping.wishlist', 'wishlist')
          .leftJoinAndSelect('wishlist.user', 'user');
      } else {
        query.leftJoinAndSelect('product.wishlistMappings', 'wishlistMapping');
      }

      query
        .where('product.status = :status', {
          status: ProductStatus.ACTIVE,
        })
        .skip(skip)
        .take(take);

      const [productList, totalItems] = await query.getManyAndCount();

      this.logger.debug(
        'Product list: ',
        productList,
        'Total items: ',
        totalItems,
      );

      const currentPage = Math.floor(skip / take) + 1;

      // 2. Calculate meta
      const meta = buildPaginationMeta(totalItems, currentPage, take);

      return {
        data: productList,
        meta,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findProductByName(
    name: string,
    skip: number,
    take: number,
  ): Promise<PaginationResponse<Product>> {
    try {
      // 1. Get product list join with brand and category
      const [productList, totalItems] = await this.productRepo
        .createQueryBuilder('product')
        .leftJoin('product.brand', 'brand')
        .leftJoin('product.categoriesMapping', 'categoryMapping')
        .leftJoin('categoryMapping.category', 'category')
        .where('product.name LIKE :name', { name: `%${name}%` })
        .orderBy('product.id', 'ASC')
        .skip(skip)
        .take(take)
        .getManyAndCount();

      // 2. Calculate meta
      const meta = buildPaginationMeta(
        totalItems,
        Math.floor(take / skip) + 1,
        take,
      );

      return {
        data: productList,
        meta,
      };
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
    brandID: number,
    status: ProductStatus,
    quantity: number,
  ): Promise<boolean> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const result = await manager.update(Product, id, {
          name,
          description,
          price,
          brand: {
            id: brandID,
          },
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

  async getProductDetail(productID: number): Promise<Product | null> {
    try {
      return await this.productRepo.findOne({
        where: {
          id: productID,
        },
        relations: {
          brand: true,
          productRating: true,
          categoriesMapping: {
            category: true,
          },
        },
        order: {
          id: 'ASC',
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async filterProducts(
    request: ProductFilterParams,
    skip: number,
    take: number,
  ): Promise<PaginationResponse<Product>> {
    try {
      // 1. Get product list join with brand and category
      const query = this.productRepo
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.brand', 'brand')
        .leftJoinAndSelect('product.categoriesMapping', 'categoryMapping')
        .leftJoinAndSelect('categoryMapping.category', 'category');

      // 2. Apply filter condition to query builder
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

      const [productList, totalItems] = await query
        .skip(skip)
        .take(take)
        .getManyAndCount();

      // 3. Calculate meta
      const meta = buildPaginationMeta(
        totalItems,
        Math.floor(take / skip) + 1,
        take,
      );

      return { data: productList, meta };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
