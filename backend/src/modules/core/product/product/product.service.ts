import { CreateProductRequest } from '@dtos/product/create-product-request.dto';
import { ProductFilterParams } from '@dtos/product/filter-product-request.dto';
import { GetAllProductResponseDto } from '@dtos/product/get-all-product-response.dto';
import { GetProductDetailResponseDto } from '@dtos/product/get-product-detail-response.dto';
import { UpdateProductInforRequestDTO } from '@dtos/product/update-product-infor-request.dto';
import { ImageType } from '@enum/image-type.enum';
import { BrandStatus } from '@enum/status/brand-status.enum';
import { CategoryStatus } from '@enum/status/categories-status.enum';
import { ImageStatus } from '@enum/status/image-status.enum';
import { ProductStatus } from '@enum/status/product-status.enum';
import { DrizzleAsyncProvider } from '@helper-modules/database/drizzle.provider';
import { ImageService } from '@helper-modules/image/image.service';
import { SearchService } from '@helper-modules/services/search.service';
import { UtilityService } from '@helper-modules/services/utility.service';
import { ErrorMessage } from '@message/error-message';
import { MessageLog } from '@message/message-log';
import { Property } from '@message/property';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  brands,
  categories,
  categoriesMapping,
  images,
  productImages,
  productRatings,
  products,
} from '@schema';
import { Brand, Category, Image, Product, ProductInsert } from '@schema-type';
import { and, asc, desc, eq, gte, inArray, like, lte, SQL } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: MySql2Database<any>,
    private searchService: SearchService,
    private imageService: ImageService,
    private utilityService: UtilityService,
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
    const { skip, take } = this.utilityService.getPagination(offset, limit);

    const productList = await this.db
      .select()
      .from(products)
      .innerJoin(brands, eq(brands.id, products.brandId))
      .limit(take)
      .offset(skip);

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

  async findProductById(id: number): Promise<Product> {
    return await this.searchService.findOneOrThrow(
      this.db,
      products,
      eq(products.id, id),
      ErrorMessage.PRODUCT_NOT_FOUND,
    );
  }

  async findProductByName(
    name: string,
    limit: number,
    offset: number,
  ): Promise<GetAllProductResponseDto[]> {
    const { skip, take } = this.utilityService.getPagination(offset, limit);

    const productList = await this.db
      .select()
      .from(products)
      .where(
        and(
          like(products.name, `%${name}%`),
          eq(products.status, ProductStatus.ACTIVE),
        ),
      )
      .limit(take)
      .offset(skip);

    const productIds = productList.map((p) => p.id);
    const brandIds = productList.map((p) => p.brandId);

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

    const brandList = await this.db
      .select()
      .from(brands)
      .where(inArray(brands.id, brandIds));

    const productMap: GetAllProductResponseDto[] = productList.map((prod) => ({
      id: prod.id,
      name: prod.name,
      description: prod.description,
      price: prod.price,
      brandName: '',
      categoryName: '',
      thumbnailUrl: '',
      status: prod.status,
      stock: prod.stocking,
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

      const brand = brandList.find((b) => b.id === prod.id);

      if (brand) {
        prod.brandName = brand.name;
      }
    }

    return productMap;
  }
  async getProductById(producId: number): Promise<Product> {
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
  }: UpdateProductInforRequestDTO): Promise<Product> {
    // 1. Check product exist
    await this.searchService.findOneOrThrow(
      this.db,
      products,
      eq(products.id, id),
    );

    // 2. Save image to db
    let thumbnail: Image;

    // 3. Change image type to thumnnail
    if (mainImage) {
      mainImage.type = ImageType.THUMBNAIL;

      // 3.1. Save image to db
      thumbnail = await this.imageService.saveImage(mainImage);
    }

    // 4. Declare image list
    let imageList: Image[];

    // 5. Change image type to product
    if (subImages) {
      subImages.forEach((image) => {
        image.type = ImageType.PRODUCT;
      });

      // 5.1. Save sub image to db
      imageList = await this.imageService.saveImages(subImages);
    }

    // 6. Get image list id
    const imageListIds = await this.db
      .select()
      .from(productImages)
      .innerJoin(images, eq(productImages.imageId, images.id))
      .where(
        and(
          eq(productImages.productId, id),
          eq(images.status, ImageStatus.ACTIVE),
        ),
      );

    // 7. Get thumbnail image
    const productThumbnail = imageListIds.find(
      (img) => (img.images.type as ImageType) === ImageType.THUMBNAIL,
    );

    // 8. Check thumbnail image of product is exist
    if (!productThumbnail) {
      throw new BadRequestException(
        `${Property.PRODUCT_THUMNAIL} ${ErrorMessage.NOT_EXIST}`,
      );
    }

    // 9. Get brand and category from name
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

    // 10. Update product
    const updateResult = await this.db.transaction(async (tx) => {
      // 10.1. Update product with new product info
      const updatedProduct = await tx
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

      // 10.5. Update category mapping
      await tx
        .update(categoriesMapping)
        .set({ categoryId: category.id, updated_at: new Date() })
        .where(eq(categoriesMapping.productId, id));

      // 10.6. Update thumnail image
      await tx
        .update(productImages)
        .set({
          productId: id,
          imageId: thumbnail.id,
          updated_at: new Date(),
        })
        .where(eq(productImages.imageId, productThumbnail.images.id));

      // 10.7. Get sub image list use for soft delete
      const subImageIds = await tx
        .select({ imageId: productImages.imageId })
        .from(productImages)
        .innerJoin(images, eq(productImages.imageId, images.id))
        .where(
          and(
            eq(productImages.productId, id),
            eq(images.type, ImageType.PRODUCT),
          ),
        );

      // 10.8. Soft delete sub image
      await tx
        .update(images)
        .set({ status: ImageStatus.REMOVED, updated_at: new Date() })
        .where(
          inArray(
            images.id,
            subImageIds.map((row) => row.imageId),
          ),
        );

      // 10.9 Insert new sub image
      if (imageList && imageList.length > 0) {
        await tx
          .insert(productImages)
          .values(
            imageList.map((img) => ({
              productId: id,
              imageId: img.id,
              updated_at: new Date(),
              imageType: ImageType.PRODUCT,
              status: ImageStatus.ACTIVE,
            })),
          )
          .$returningId();
      }
      // 10.10. Return updated product
      return {
        updatedProduct,
      };
    });

    // 11. Check if updating product is success
    if (!updateResult) {
      this.logger.error(`${MessageLog.PRODUCT} ${MessageLog.CAN_NOT_UPDATE}`);
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    }

    return await this.getProductById(id);
  }

  async removeProductById(productId: number): Promise<Product> {
    // 1. Get product infor
    const product: Product = await this.searchService.findOneOrThrow(
      this.db,
      products,
      eq(products.id, productId),
    );

    // 2. Soft delete product
    const updateResult = await this.db.transaction((tx) =>
      tx
        .update(products)
        .set({ status: ProductStatus.REMOVED, updated_at: new Date() })
        .where(eq(products.id, productId)),
    );

    // 3. Check if updati@ng product status is success
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
      const { skip, take } = this.utilityService.getPagination(page, limit);
      this.logger.debug(`Pagination - skip: ${skip}, take: ${take}`);

      const [product]: Product[] = await this.db
        .select()
        .from(products)
        .where(eq(products.id, productId))
        .limit(take)
        .offset(skip);

      const imageList = await this.db
        .select()
        .from(productImages)
        .innerJoin(images, eq(productImages.imageId, images.id))
        .where(eq(productImages.productId, productId));

      const productRatingList: { starRated: number }[] = await this.db
        .select({ starRated: productRatings.starRated })
        .from(productRatings)
        .where(eq(productRatings.productId, productId));

      const avgRating =
        productRatingList.length > 0
          ? productRatingList.reduce(
              (sum, rating) => sum + rating.starRated,
              0,
            ) / productRatingList.length
          : 0;

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
        starRated: avgRating,
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

  async filterProducts({
    limit,
    page,
    brandName,
    discount,
    maxPrice,
    minPrice,
    name,
    sortOrder,
    stocking,
    status,
    category,
  }: ProductFilterParams): Promise<GetAllProductResponseDto[]> {
    const { skip, take } = this.utilityService.getPagination(page, limit);

    const cleanName = name?.trim().toLowerCase();

    const conditions: SQL[] = [];

    const query = this.db
      .select()
      .from(products)
      .innerJoin(brands, eq(brands.id, products.brandId));

    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    const productList = await this.db
      .select()
      .from(products)
      .innerJoin(brands, eq(brands.id, products.brandId))
      .innerJoin(
        categoriesMapping,
        eq(categoriesMapping.productId, products.id),
      )
      .innerJoin(categories, eq(categoriesMapping.categoryId, categories.id))
      .where(
        and(
          minPrice ? gte(products.price, minPrice) : undefined,
          maxPrice ? lte(products.price, maxPrice) : undefined,
          status ? eq(products.status, status) : undefined,
          name ? like(products.name, `%${cleanName}%`) : undefined,
          brandName ? like(brands.name, `%${brandName}%`) : undefined,
          stocking ? eq(products.stocking, stocking) : undefined,
          discount ? eq(products.discount, discount) : undefined,
          category ? eq(categories.name, category) : undefined,
        ),
      )
      .orderBy(sortOrder === 'asc' ? asc(products.price) : desc(products.price))
      .limit(take)
      .offset(skip);

    this.logger.log(JSON.stringify(productList));

    const productIds = productList.map((p) => p.products.id);

    const imageList = await this.db
      .select()
      .from(productImages)
      .innerJoin(images, eq(productImages.imageId, images.id))
      .where(inArray(productImages.productId, productIds));

    const productMap: GetAllProductResponseDto[] = productList.map((prod) => ({
      id: prod.products.id,
      name: prod.products.name,
      description: prod.products.description,
      price: prod.products.price,
      brandName: prod.brands.name,
      categoryName: prod.categories.name,
      thumbnailUrl: '',
      status: prod.products.status,
      stock: prod.products.stocking,
    }));

    for (const prod of productMap) {
      const img = imageList.find(
        (img) =>
          img.product_images.productId === prod.id &&
          (img.images.type as ImageType) === ImageType.THUMBNAIL,
      );

      if (img) {
        prod.thumbnailUrl = img.images.url;
      }
    }

    return productMap;
  }
}
