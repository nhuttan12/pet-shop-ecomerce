import { Brand, BrandService } from '@brand';
import {
  Category,
  CategoryErrorMessages,
  CategoryMapping,
  CategoryMappingService,
  CategoryMessagesLog,
  CategoryService,
} from '@category';
import {
  ErrorMessage,
  Image,
  ImageErrorMessage,
  ImageMessageLog,
  ImageService,
  ImageType,
  SubjectType,
  UtilityService,
} from '@common';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateProductRequest,
  GetAllProductResponseDto,
  GetProductDetailRequestDto,
  GetProductDetailResponseDto,
  Product,
  ProductErrorMessage,
  ProductFilterParams,
  ProductMessageLog,
  ProductRating,
  ProductRatingService,
  ProductRepository,
  UpdateProductInforRequestDTO,
} from '@product';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(
    private readonly imageService: ImageService,
    private readonly utilityService: UtilityService,
    private readonly productRepo: ProductRepository,
    private readonly brandService: BrandService,
    private readonly categoryService: CategoryService,
    private readonly categoryMappingService: CategoryMappingService,
    private readonly productRatingService: ProductRatingService,
  ) {}

  async getProductByID(productID: number): Promise<Product> {
    // 1. Get product by id
    const product: Product | null =
      await this.productRepo.getProductById(productID);

    // 2. Check get product by id result
    if (!product) {
      this.logger.warn(ProductMessageLog.PRODUCT_NOT_FOUND);
      throw new NotFoundException(ProductErrorMessage.PRODUCT_NOT_FOUND);
    }

    return product;
  }

  async createProduct(request: CreateProductRequest): Promise<Product> {
    // 1. Get brand and category from id
    const brand: Brand = await this.brandService.getBrandById({
      id: request.brandID,
    });

    const category: Category = await this.categoryService.getCategoryById({
      id: request.categoryID,
    });

    // 2. Change image type of main image to thumbnail
    request.mainImage.type = ImageType.THUMBNAIL;

    // 3. Change image type of sub images to product
    request.subImages.forEach((image) => {
      image.type = ImageType.PRODUCT;
    });

    // 4. Create product
    const product: Product = await this.productRepo.createProduct(
      request.name,
      request.description,
      request.price,
      brand,
      request.quantity,
      request.discount,
    );

    // 5. Check create product result
    if (!product) {
      this.logger.warn(ProductMessageLog.PRODUCT_CREATED_FAILED);
      throw new InternalServerErrorException(
        ProductErrorMessage.PRODUCT_CREATED_FAILED,
      );
    }

    // 6. Save image
    const thumbnail: Image = await this.imageService.saveImage(
      request.mainImage,
      product.id,
      SubjectType.PRODUCT,
    );

    // 7. Check create thumbnail image result
    if (!thumbnail) {
      this.logger.warn(ProductMessageLog.THUMBNAIL_IMAGE_NOT_CREATED);
      throw new InternalServerErrorException(
        ProductErrorMessage.THUMBNAIL_IMAGE_NOT_CREATED,
      );
    }

    // 8. Save sub images
    const imageList: Image[] = await Promise.all(
      request.subImages.map(async (image) => {
        return await this.imageService.saveImage(
          image,
          product.id,
          SubjectType.PRODUCT,
        );
      }),
    );

    // 9. Check create sub image result
    if (!imageList) {
      this.logger.warn(ProductMessageLog.PRODUCT_IMAGE_NOT_CREATED);
      throw new InternalServerErrorException(
        ProductErrorMessage.PRODUCT_IMAGE_NOT_CREATED,
      );
    }

    // 10. Create category mapping
    const categoryMapping: CategoryMapping =
      await this.categoryMappingService.createCategoryMapping(
        category,
        product,
      );

    // 11. Check create category mapping
    if (!categoryMapping) {
      this.logger.warn(CategoryMessagesLog.CATEGORY_MAPPING_NOT_CREATED);
      throw new InternalServerErrorException(
        CategoryErrorMessages.CATEGORY_CANNOT_BE_CREATED,
      );
    }

    return product;
  }

  async getAllProducts(
    limit: number,
    offset: number,
  ): Promise<GetAllProductResponseDto[]> {
    // 1. Get pagination information
    const { skip, take } = this.utilityService.getPagination(offset, limit);

    // 2. Get product list
    const productList: Product[] =
      await this.productRepo.getAllProductWithImageAndCategory(skip, take);

    // 3. Create Map for mapping image to product list
    const imageMap: Map<number, Image[]> = new Map();

    await Promise.all(
      productList.map(async (product) => {
        const images =
          await this.imageService.getImageListBySubjectIdAndSubjectType(
            product.id,
            SubjectType.PRODUCT,
          );
        imageMap.set(product.id, images);
      }),
    );

    // 4. Mapping product list to dto using plainToInstance
    const productDtos = plainToInstance(
      GetAllProductResponseDto,
      productList.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        brandName: product.brand.name,
        categoryName: product.categoriesMapping?.[0]?.category?.name,
        status: product.status,
        stock: product.stocking,
        thumbnailUrl: imageMap.get(product.id)?.[0].url,
      })),
      {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      },
    );

    return productDtos;
  }

  async findProductByName(
    name: string,
    limit: number,
    offset: number,
  ): Promise<GetAllProductResponseDto[]> {
    // 1. Get pagination information
    const { skip, take } = this.utilityService.getPagination(offset, limit);

    // 2. Get product list
    const productList: Product[] = await this.productRepo.findProductByName(
      name,
      skip,
      take,
    );

    // 3. Create map for mapping image to product list
    const imageMap: Map<number, Image[]> = new Map();

    await Promise.all(
      productList.map(async (product) => {
        const images =
          await this.imageService.getImageListBySubjectIdAndSubjectType(
            product.id,
            SubjectType.PRODUCT,
          );
        imageMap.set(product.id, images);
      }),
    );

    // 4. Convert product list to dto using plainToInstance method
    const productDtos = plainToInstance(
      GetAllProductResponseDto,
      productList.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        brandName: product.brand.name,
        categoryName: product.categoriesMapping?.[0]?.category?.name,
        status: product.status,
        stock: product.stocking,
        thumbnailUrl: imageMap.get(product.id)?.[0].url,
      })),
      {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      },
    );

    return productDtos;
  }

  async updateProductInfor(
    request: UpdateProductInforRequestDTO,
  ): Promise<Product> {
    // 1. Check product exist
    const product = await this.getProductByID(request.id);

    // 2. Get thumbnail image and product image from product
    const thumbnailImage =
      await this.imageService.getImageBySubjectIdAndSubjectType(
        product.id,
        SubjectType.PRODUCT,
        ImageType.THUMBNAIL,
      );
    const productImages =
      await this.imageService.getImageListBySubjectIdAndSubjectType(
        product.id,
        SubjectType.PRODUCT,
        ImageType.PRODUCT,
      );

    // 3. Change image type to thumnnail
    if (request.mainImage.url !== thumbnailImage.url) {
      request.mainImage.type = ImageType.THUMBNAIL;

      // 3.1. Soft delete old thumbnail image
      const result = await this.imageService.removeImage(thumbnailImage.id);

      if (!result) {
        this.logger.warn(ImageMessageLog.CANNOT_UPDATE_IMAGE);
        throw new NotFoundException(ImageErrorMessage.CANNOT_UPDATE_IMAGE);
      }

      // 3.2. Save thumbnail image to db
      const newThumbnailImage: Image = await this.imageService.saveImage(
        request.mainImage,
        request.id,
        SubjectType.PRODUCT,
      );

      // 3.3. Check save thumbnail image result
      if (!newThumbnailImage) {
        this.logger.warn(ImageMessageLog.CANNOT_UPDATE_IMAGE);
        throw new NotFoundException(ImageErrorMessage.CANNOT_UPDATE_IMAGE);
      }
    }

    // 4. Change image type to product
    if (request.subImages) {
      // 4.1. Get current url and request url
      const currentUrls: string[] = productImages.map((img) => img.url).sort();
      const requestUrls: string[] = request.subImages
        .map((img) => img.url)
        .sort();

      // 4.2. Check difference between two array
      const isDifferent: boolean =
        currentUrls.length !== requestUrls.length ||
        currentUrls.some((url, index) => url !== requestUrls[index]);

      if (isDifferent) {
        // 4.2.1. Change image type to produc
        request.subImages.forEach((image) => {
          image.type = ImageType.PRODUCT;
        });

        // 4.2.2. Soft delete old sub image
        for (const img of productImages) {
          const deleted: boolean = await this.imageService.removeImage(img.id);

          if (!deleted) {
            this.logger.warn(ImageMessageLog.CANNOT_UPDATE_IMAGE);
            throw new NotFoundException(ImageErrorMessage.CANNOT_UPDATE_IMAGE);
          }
        }
      }

      // 4.2. Save sub image to db
      const newProductImages: Image[] = await this.imageService.saveImages(
        request.subImages,
        request.id,
        SubjectType.PRODUCT,
      );

      // 4.3. Check save sub image result
      if (!newProductImages) {
        this.logger.warn(ImageMessageLog.CANNOT_UPDATE_IMAGE);
        throw new NotFoundException(ImageErrorMessage.CANNOT_UPDATE_IMAGE);
      }
    }

    // 5. Get brand and category by id
    const brand: Brand = await this.brandService.getBrandById({
      id: request.brandID,
    });

    // 6. Update product
    const updateResult: boolean = await this.productRepo.updateProduct(
      request.id,
      request.name,
      request.description,
      request.price,
      brand,
      request.status,
      request.stock,
    );

    // 7. Check if updating product is success
    if (!updateResult) {
      this.logger.warn(ProductMessageLog.PRODUCT_UPDATED_FAILED);
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    }

    // 8. Get category mapping list with category and product
    const oldCategoryMappings: CategoryMapping[] =
      await this.categoryMappingService.findCategoryMappingListWithProduct(
        product,
      );

    // 9. Iterate category mapping list and soft delete each of them
    for (const mapping of oldCategoryMappings) {
      const success: boolean =
        await this.categoryMappingService.removeCategoryMapping(mapping.id);
      if (!success) {
        throw new InternalServerErrorException(
          `Deleting category mapping with ID ${mapping.id} failed.`,
        );
      }
    }

    // 10. Create new category mapping
    const categoryIDs = request.categoryIDs || [];

    for (const categoryId of categoryIDs) {
      const category = await this.categoryService.getCategoryById({
        id: categoryId,
      });
      await this.categoryMappingService.createCategoryMapping(
        category,
        product,
      );
    }

    return await this.getProductByID(request.id);
  }

  async removeProductById(productID: number): Promise<Product> {
    // 1. Get product infor
    const product: Product = await this.getProductByID(productID);

    // 2. Soft delete product
    const updateResult = await this.productRepo.removeProduct(product.id);

    // 3. Checking update product result
    if (!updateResult) {
      this.logger.warn(ProductMessageLog.REMOVE_PRODUCT_FAILED);
      throw new InternalServerErrorException(
        ProductErrorMessage.REMOVE_PRODUCT_FAILED,
      );
    }

    // 4. Return new product
    return await this.getProductByID(productID);
  }

  async getProductDetail(
    request: GetProductDetailRequestDto,
  ): Promise<GetProductDetailResponseDto> {
    try {
      // 1. Get pagination information
      const { skip, take } = this.utilityService.getPagination(
        request.page,
        request.limit,
      );
      this.logger.debug(`Pagination - skip: ${skip}, take: ${take}`);

      const product: Product | null = await this.productRepo.getProductDetail(
        request.productID,
        skip,
        take,
      );

      if (!product) {
        this.logger.warn(ProductMessageLog.PRODUCT_NOT_FOUND);
        throw new NotFoundException(ProductErrorMessage.PRODUCT_NOT_FOUND);
      }

      const thumbnailImage: Image =
        await this.imageService.getImageBySubjectIdAndSubjectType(
          product.id,
          SubjectType.PRODUCT,
          ImageType.THUMBNAIL,
        );

      const productImage: Image[] =
        await this.imageService.getImageListBySubjectIdAndSubjectType(
          request.productID,
          SubjectType.PRODUCT,
          ImageType.PRODUCT,
        );

      const productRatingList: ProductRating[] =
        await this.productRatingService.getRatingByProductId(request.productID);

      const avgRating =
        productRatingList.length > 0
          ? productRatingList.reduce(
              (sum, rating) => sum + rating.starRated,
              0,
            ) / productRatingList.length
          : 0;

      const categoryMappingList: CategoryMapping[] =
        await this.categoryMappingService.findCategoryMappingListWithProduct(
          product,
        );

      const brand: Brand = await this.brandService.getBrandById({
        id: product.brand.id,
      });

      const rawResponse = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        brandName: brand,
        categoryName: categoryMappingList.map(
          (mapping) => mapping.category.name,
        ),
        thumbnailUrl: thumbnailImage.url,
        imagesUrl: productImage.map((img) => img.url),
        starRated: avgRating,
        status: product.status,
        stock: product.stocking,
      };

      return plainToInstance(GetProductDetailResponseDto, rawResponse, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    } catch (error) {
      this.logger.error(`Error getting product detail: ${error}`);
      throw error;
    } finally {
      this.logger.log(`Get info with product id ${request.productID}`);
    }
  }

  async filterProducts(
    request: ProductFilterParams,
  ): Promise<GetAllProductResponseDto[]> {
    const { skip, take } = this.utilityService.getPagination(
      request.page,
      request.limit,
    );

    const productList = await this.productRepo.filterProducts(
      request,
      skip,
      take,
    );

    const imageMap: Map<number, Image> = new Map();

    await Promise.all(
      productList.map(async (product) => {
        const images: Image =
          await this.imageService.getImageBySubjectIdAndSubjectType(
            product.id,
            SubjectType.PRODUCT,
            ImageType.THUMBNAIL,
          );
        imageMap.set(product.id, images);
      }),
    );

    const rawData = productList.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      brandName: product.brand?.name ?? '',
      categoryName: product.categoriesMapping?.[0]?.category?.name ?? '',
      thumbnailUrl: imageMap.get(product.id)?.url ?? '',
      status: product.status,
      stock: product.stocking,
    }));

    return plainToInstance(GetAllProductResponseDto, rawData, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }
}
