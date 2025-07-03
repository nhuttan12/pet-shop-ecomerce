import { Brand } from '@brand';
import { Injectable, Logger } from '@nestjs/common';
import { Product, ProductStatus } from '@product';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ProductRepository {
  private readonly logger = new Logger(ProductRepository.name);
  constructor(
    private readonly productRepo: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}

  async getProductById(id: number): Promise<Product | null> {
    return await this.productRepo.findOneBy({ id });
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
}
