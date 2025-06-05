import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { and, eq, inArray, like } from 'drizzle-orm';
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
import { GetProductDetailResponseDto } from 'src/helper/dto/product/get-product-detail-response.dto';
import { ImageType } from 'src/helper/enum/image-type.enum';
import { BrandStatus } from 'src/helper/enum/status/brand-status.enum';
import { CategoryStatus } from 'src/helper/enum/status/categories-status.enum';
import { ImageStatus } from 'src/helper/enum/status/image-status.enum';
import { ProductStatus } from 'src/helper/enum/status/product-status.enum';
import { ErrorMessage } from 'src/helper/message/error-message';
import { MessageLog } from 'src/helper/message/message-log';
import { Property } from 'src/helper/message/property';
import { SearchService } from 'src/modules/helper/services/search.service';
import { DrizzleAsyncProvider } from 'src/modules/helper/database/drizzle.provider';
import { ImageService } from 'src/modules/helper/image/image.service';
import { UpdateProductInforRequestDTO } from 'src/helper/dto/product/update-product-infor-request.dto';

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
    offset = offset <= 0 ? 0 : offset - 1;
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

  async findProductByName(
    name: string,
    limit: number,
    offset: number,
  ): Promise<GetAllProductResponseDto[]> {
    offset = offset <= 0 ? 0 : offset - 1;
    const productList = await this.db
      .select()
      .from(products)
      .where(
        and(
          like(products.name, `%${name}%`),
          eq(products.status, ProductStatus.ACTIVE),
        ),
      )
      .limit(limit)
      .offset(offset);

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
    //Check product exist
    await this.searchService.findOneOrThrow(
      this.db,
      products,
      eq(products.id, id),
    );

    //save image to db
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

    //get image list id
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

    //get thumbnail image
    const productThumbnail = imageListIds.find(
      (img) => (img.images.type as ImageType) === ImageType.THUMBNAIL,
    );

    if (!productThumbnail) {
      throw new BadRequestException(
        `${Property.PRODUCT_THUMNAIL} ${ErrorMessage.NOT_EXIST}`,
      );
    }

    //get brand and category from name
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

    //update product
    const updateResult = await this.db.transaction(async (tx) => {
      //update product with new product info
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

      //update category mapping
      await tx
        .update(categoriesMapping)
        .set({ categoryId: category.id, updated_at: new Date() })
        .where(eq(categoriesMapping.productId, id));

      //update thumnail image
      await tx
        .update(productImages)
        .set({
          productId: id,
          imageId: thumbnail.id,
          updated_at: new Date(),
        })
        .where(eq(productImages.imageId, productThumbnail.images.id));

      //sub image list use for soft delete
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

      await tx
        .update(images)
        .set({ status: ImageStatus.REMOVED, updated_at: new Date() })
        .where(
          inArray(
            images.id,
            subImageIds.map((row) => row.imageId),
          ),
        );

      //inser new sub image
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

      return {
        updatedProduct,
      };
    });

    if (!updateResult) {
      this.logger.error(`${MessageLog.PRODUCT} ${MessageLog.CAN_NOT_UPDATE}`);
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    }

    return await this.getProductById(id);
  }

  async removeProductById(productId: number): Promise<Product> {
    const product: Product = await this.searchService.findOneOrThrow(
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
