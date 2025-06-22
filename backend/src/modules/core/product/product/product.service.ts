import { CreateProductRequest } from '@dtos/product/create-product-request.dto';
import { GetAllProductResponseDto } from '@dtos/product/get-all-product-response.dto';
import { GetProductDetailResponseDto } from '@dtos/product/get-product-detail-response.dto';
import { UpdateProductInforRequestDTO } from '@dtos/product/update-product-infor-request.dto';
import { ImageType } from '@enum/image-type.enum';
import { BrandStatus } from '@enum/status/brand-status.enum';
import { CategoryStatus } from '@enum/status/categories-status.enum';
import { ImageStatus } from '@enum/status/image-status.enum';
import { ProductStatus } from '@enum/status/product-status.enum';
import { StripeInterval } from '@enum/stripe-interval.enum';
import { DrizzleAsyncProvider } from '@helper-modules/database/drizzle.provider';
import { ImageService } from '@helper-modules/image/image.service';
import { SearchService } from '@helper-modules/services/search.service';
import { UtilityService } from '@helper-modules/services/utility.service';
import { StripeService } from '@helper-modules/stripe/stripe.service';
import { ErrorMessage } from '@message/error-message';
import { MessageLog } from '@message/message-log';
import { Property } from '@message/property';
import { StripeErrorMessage } from '@message/srtipe-message';
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
  productRatings,
  images,
  productImages,
  products,
  stripeProducts,
  stripePrices,
} from '@schema';
import {
  Brand,
  Category,
  Image,
  Product,
  ProductInsert,
  StripePrice,
  StripePriceInsert,
  StripeProduct,
} from '@schema-type';
import { and, eq, inArray, like } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import Stripe from 'stripe';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: MySql2Database<any>,
    private searchService: SearchService,
    private imageService: ImageService,
    private utilityService: UtilityService,
    private stripeService: StripeService,
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
    this.logger.debug(`Brand: ${JSON.stringify(brand)}`);

    const category: Category = await this.searchService.findOneOrThrow(
      this.db,
      categories,
      eq(categories.name, categoryName),
    );
    this.logger.debug(`Category: ${JSON.stringify(category)}`);

    // set main image type to thumbnail
    mainImage.type = ImageType.THUMBNAIL;

    // save the thumbnail image to db
    const thumbnail: Image = await this.imageService.saveImage(mainImage);
    this.logger.debug(`Thumbnail: ${JSON.stringify(thumbnail)}`);

    // set sub image type to product
    subImages.forEach((image) => {
      image.type = ImageType.PRODUCT;
    });

    // save the sub images to db
    const imageList: Image[] = await this.imageService.saveImages(subImages);

    // create product with deffault field
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

    // checking product after insert
    const productResult: Product = await this.searchService.findOneOrThrow(
      this.db,
      products,
      eq(products.id, productInsert.id),
    );

    const result = await this.db.transaction(async (tx) => {
      // create thumbnail image reference to product in db
      const [productImageThumbnailInserted] = await tx
        .insert(productImages)
        .values({
          productId: productInsert.id,
          imageId: thumbnail.id,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .$returningId();

      // create category reference to product in db
      const [categoryMappingInserted] = await tx
        .insert(categoriesMapping)
        .values({
          productId: productInsert.id,
          categoryId: category.id,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .$returningId();

      // create sub image reference to product in db
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

      // return the result for checking
      return {
        productImageThumbnailInserted,
        categoryMappingInserted,
        productImagesInsert,
      };
    });

    //checking thumbnail after insert
    await this.searchService.findOneOrThrow(
      this.db,
      productImages,
      eq(productImages.id, result.productImageThumbnailInserted.id),
    );

    //checking category after insert
    await this.searchService.findOneOrThrow(
      this.db,
      categoriesMapping,
      eq(categoriesMapping.id, result.categoryMappingInserted.id),
    );

    //checking product sub image after insert
    await this.searchService.findOneOrThrow(
      this.db,
      productImages,
      inArray(
        productImages.id,
        result.productImagesInsert.map((img) => img.id),
      ),
    );

    // call service to create product in stripe cloud
    const stripeProduct = await this.stripeService.createProduct(
      name,
      description,
    );

    // call service to create product in stripe cloud
    const stripePrice = await this.stripeService.createPrice(
      stripeProduct.id,
      price,
    );

    await this.db.transaction(async (tx) => {
      // create product stripe in db
      const createProductStripe = await tx.insert(stripeProducts).values({
        productId: productResult.id,
        stripeProductId: stripeProduct.id,
        name: stripeProduct.name,
        description: stripeProduct.description,
        createdAt: new Date(),
      });

      const stripeInsert: StripePriceInsert = {
        productId: productResult.id,
        stripeProductId: stripeProduct.id,
        stripePriceId: stripePrice.id,
        amount: stripePrice.unit_amount,
        currency: stripePrice.currency,
        interval: stripePrice.recurring?.interval,
        createdAt: new Date(),
      };

      // create price stripe in db
      const createPriceStripe = await tx
        .insert(stripePrices)
        .values(stripeInsert);

      return {
        createProductStripe,
        createPriceStripe,
      };
    });

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

      // search and check stripe product is exist
      const stripeProduct: StripeProduct =
        await this.searchService.findOneOrThrow(
          this.db,
          stripeProducts,
          eq(stripeProducts.productId, id),
        );

      // update product in stripe cloud
      await this.stripeService.updateProduct(
        stripeProduct.stripeProductId,
        name,
        description,
      );

      if (price) {
        // getting price stripe in db and checking exist
        const oldPriceStripe: StripePrice =
          await this.searchService.findOneOrThrow(
            this.db,
            stripePrices,
            eq(stripePrices.productId, id),
            StripeErrorMessage.STRIPE_PRICE_NOT_FOUND,
          );

        // update price in stripe service
        const newPriceStripe: Stripe.Price =
          await this.stripeService.updatePrice({
            newAmount: price,
            oldPriceId: oldPriceStripe.stripePriceId,
            stripeProductId: stripeProduct.stripeProductId,
            currency: oldPriceStripe.currency,
            interval: oldPriceStripe.interval as StripeInterval,
          });

        // insert new stripe in db
        await this.db.transaction(async (tx) => {
          const newPriceStripeInsert: StripePriceInsert = {
            stripeProductId: stripeProduct.stripeProductId,
            stripePriceId: newPriceStripe.id,
            productId: id,
            amount: newPriceStripe.unit_amount,
            currency: newPriceStripe.currency,
            interval: newPriceStripe.recurring?.interval,
            createdAt: new Date(),
          };

          return await tx.insert(stripePrices).values(newPriceStripeInsert);
        });
      }

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
}
