import { UpdateProductInforRequestDTO } from './../../helper/dto/product/update-product-infor-request.dto';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { and, eq, inArray } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import {
  Brand,
  Category,
  Image,
  Product,
  ProductInsert,
} from 'src/db/helper/schema-type';
import {
  brands,
  categories,
  categoriesMapping,
  images,
  productImages,
  products,
} from 'src/db/schema';
import { CreateProductRequest } from 'src/helper/dto/product/create-product-request.dto';
import { GetAllProductResponseDto } from 'src/helper/dto/product/get-all-product-response.dto';
import { ImageType } from 'src/helper/enum/image-type.enum';
import { ProductStatus } from 'src/helper/enum/status/product-status.enum';
import { SearchService } from 'src/helper/services/search.service';
import { DrizzleAsyncProvider } from 'src/modules/database/drizzle.provider';
import { ImageService } from './../image/image.service';
import { GetProductDetailResponseDto } from 'src/helper/dto/product/get-product-detail-response.dto';
import { CategoryStatus } from 'src/helper/enum/status/categories-status.enum';
import { BrandStatus } from 'src/helper/enum/status/brand-status.enum';
import { MessageLog } from 'src/helper/message/message-log';
import { ErrorMessage } from 'src/helper/message/error-message';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: MySql2Database<any>,
    private searchService: SearchService,
    private imageService: ImageService,
  ) {}

  async createProduct({
    brandName,
    categoryName,
    description,
    discount,
    name,
    price,
    quantity,
    mainImage,
    subImages,
  }: CreateProductRequest): Promise<Product> {
    const brand: Brand = await this.searchService.findOneOrThrow(
      this.db,
      brands,
      eq(brands.name, brandName),
    );

    const category: Category = await this.searchService.findOneOrThrow(
      this.db,
      categories,
      eq(categories.name, categoryName),
    );

    mainImage.type = ImageType.THUMBNAIL;

    const thumbnail: Image = await this.imageService.saveImage(mainImage);

    subImages.forEach((image) => {
      image.type = ImageType.PRODUCT;
    });

    const imageList: Image[] = await this.imageService.saveImages(subImages);

    const product: ProductInsert = {
      brandId: brand.id,
      description,
      discount,
      name,
      price,
      stocking: quantity,
      status: ProductStatus.ACTIVE,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const [productInsert] = await this.db.transaction((tx) => {
      return tx.insert(products).values(product).$returningId();
    });

    const productResult: Product = await this.searchService.findOneOrThrow(
      this.db,
      products,
      eq(products.id, productInsert.id),
    );

    const result = await this.db.transaction(async (tx) => {
      const [productImageThumbnailInserted] = await tx
        .insert(productImages)
        .values({
          productId: productInsert.id,
          imageId: thumbnail.id,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .$returningId();

      const [categoryMappingInserted] = await tx
        .insert(categoriesMapping)
        .values({
          productId: productInsert.id,
          categoryId: category.id,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .$returningId();

      const productImagesInsert = await tx
        .insert(productImages)
        .values(
          imageList.map((img) => ({
            productId: productInsert.id,
            imageId: img.id,
            created_at: new Date(),
            updated_at: new Date(),
          })),
        )
        .$returningId();

      return {
        productImageThumbnailInserted,
        categoryMappingInserted,
        productImagesInsert,
      };
    });

    await this.searchService.findOneOrThrow(
      this.db,
      productImages,
      eq(productImages.id, result.productImageThumbnailInserted.id),
    );

    await this.searchService.findOneOrThrow(
      this.db,
      categoriesMapping,
      eq(categoriesMapping.id, result.categoryMappingInserted.id),
    );

    await this.searchService.findOneOrThrow(
      this.db,
      productImages,
      inArray(
        productImages.id,
        result.productImagesInsert.map((img) => img.id),
      ),
    );

    return productResult;
  }

  async getAllProducts(
    limit: number,
    offset: number,
  ): Promise<GetAllProductResponseDto[]> {
    const productList = await this.db
      .select()
      .from(products)
      .innerJoin(brands, eq(brands.id, products.brandId))
      .limit(limit)
      .offset(offset);

    const productIds = productList.map((p) => p.products.id);

    const iamgeList = await this.db
      .select()
      .from(productImages)
      .innerJoin(images, eq(productImages.imageId, images.id))
      .where(inArray(productImages.productId, productIds));

    const categoryList = await this.db
      .select()
      .from(categoriesMapping)
      .innerJoin(categories, eq(categoriesMapping.categoryId, categories.id))
      .where(inArray(categoriesMapping.productId, productIds));

    const productMap: GetAllProductResponseDto[] = productList.map((prod) => ({
      id: prod.products.id,
      name: prod.products.name,
      description: prod.products.description,
      price: prod.products.price,
      brandName: prod.brands.name,
      categoryName: '',
      thumbnailUrl: '',
      status: prod.products.status,
      stock: prod.products.stocking,
    }));

    for (const prod of productMap) {
      const img = iamgeList.find(
        (img) =>
          img.product_images.productId === prod.id &&
          (img.images.type as ImageType) === ImageType.THUMBNAIL,
      );

      if (img) {
        prod.thumbnailUrl = img.images.url;
      }

      const cate = categoryList.find(
        (c) => c.categories_mapping.productId === prod.id,
      );

      if (cate) {
        prod.categoryName = cate.categories.name;
      }
    }

    return productMap;
  }

  async findProductByName(name: string, limit: number, offset: number) {
    return await this.searchService.findManyOrReturnEmptyArray(
      this.db,
      products,
      and(eq(products.name, name), eq(products.status, ProductStatus.ACTIVE)),
      limit,
      offset,
    );
  }
  async getProductById(producId: number) {
    return this.searchService.findOneOrThrow(
      this.db,
      products,
      eq(products.id, producId),
    );
  }
  async updateProductInfor({
    id,
    name,
    brandName,
    categoryName,
    description,
    price,
    stock,
    status,
    mainImage,
    subImages,
  }: UpdateProductInforRequestDTO) {
    await this.searchService.findOneOrThrow(
      this.db,
      products,
      eq(products.id, id),
    );

    let thumbnail: Image;

    if (mainImage) {
      mainImage.type = ImageType.THUMBNAIL;

      thumbnail = await this.imageService.saveImage(mainImage);
    }

    let imageList: Image[];

    if (subImages) {
      subImages.forEach((image) => {
        image.type = ImageType.PRODUCT;
      });

      imageList = await this.imageService.saveImages(subImages);
    }

    const brand: Brand = await this.searchService.findOneOrThrow(
      this.db,
      brands,
      eq(brands.name, brandName),
    );

    const category: Category = await this.searchService.findOneOrThrow(
      this.db,
      categories,
      eq(categories.name, categoryName),
    );

    const updateResult = await this.db.transaction(async (tx) => {
      await tx
        .update(products)
        .set({
          name,
          brandId: brand.id,
          description,
          price,
          stocking: stock,
          status,
          updated_at: new Date(),
        })
        .where(eq(products.id, id));

      await tx
        .update(categoriesMapping)
        .set({ categoryId: category.id, updated_at: new Date() })
        .where(eq(categoriesMapping.productId, id));

      await tx
        .update(productImages)
        .set({
          productId: id,
          imageId: thumbnail.id,
          updated_at: new Date(),
        })
        .where();

      await Promise.all(
        imageList.map(
          (img) =>
            tx
              .update(productImages)
              .set({
                productId: id,
                imageId: img.id,
                updated_at: new Date(),
              })
              .where(eq(productImages.imageId, img.id)), // hoặc .where(...) phù hợp
        ),
      );
    });

    if (!updateResult) {
      this.logger.error(`${MessageLog.PRODUCT} ${MessageLog.CAN_NOT_UPDATE}`);
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeProductById(productId: number): Promise<Product> {
    const product = await this.searchService.findOneOrThrow(
      this.db,
      products,
      eq(products.id, productId),
    );

    const updateResult = await this.db.transaction((tx) =>
      tx
        .update(products)
        .set({ status: ProductStatus.REMOVED, updated_at: new Date() })
        .where(eq(products.id, productId)),
    );

    if (!updateResult) {
      this.logger.error(`${MessageLog.PRODUCT} ${MessageLog.CAN_NOT_DELETE}`);
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    }

    return product;
  }
  async getProductDetail(
    productId: number,
    page: number,
    limit: number,
  ): Promise<GetProductDetailResponseDto> {
    try {
      const offset = Math.max(0, page - 1);
      this.logger.debug(`Pagination - limit: ${limit}, offset: ${offset}`);

      const [product]: Product[] = await this.db
        .select()
        .from(products)
        .where(eq(products.id, productId))
        .limit(limit)
        .offset(offset);

      const imageList = await this.db
        .select()
        .from(productImages)
        .innerJoin(images, eq(productImages.imageId, images.id))
        .where(eq(productImages.productId, productId));

      const categoryList = await this.db
        .select()
        .from(categoriesMapping)
        .innerJoin(categories, eq(categoriesMapping.categoryId, categories.id))
        .where(eq(categoriesMapping.productId, productId));

      const brandList = await this.db
        .select()
        .from(brands)
        .where(eq(brands.id, product.brandId));

      const result: GetProductDetailResponseDto = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        brandName: '',
        categoryName: '',
        thumbnailUrl: '',
        imagesUrl: [],
        status: product.status,
        stock: product.stocking,
      };

      const img = imageList.find(
        (img) =>
          img.product_images.productId === productId &&
          (img.images.type as ImageType) === ImageType.THUMBNAIL,
      );

      if (img) {
        result.thumbnailUrl = img.images.url;
      }

      const subImg = imageList.filter(
        (img) =>
          img.product_images.productId === productId &&
          (img.images.type as ImageType) === ImageType.PRODUCT,
      );

      if (subImg.length > 0) {
        result.imagesUrl = subImg.map((img) => img.images.url);
      }

      const cate = categoryList.find(
        (c) =>
          c.categories_mapping.productId === productId &&
          (c.categories.status as CategoryStatus) === CategoryStatus.ACTIVE,
      );

      if (cate) {
        result.categoryName = cate.categories.name;
      }

      const brandName = brandList.find(
        (b) =>
          b.id === product.brandId &&
          (b.status as BrandStatus) === BrandStatus.ACTIVE,
      );

      if (brandName) {
        result.brandName = brandName.name;
      }

      return result;
    } catch (error) {
      this.logger.error(`Error getting product detail: ${error}`);
      throw error;
    } finally {
      this.logger.log(`Get info with product id ${productId}`);
    }
  }
}
