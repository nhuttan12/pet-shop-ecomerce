import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { BrandService } from '@brand/brand.service';
import { Brand } from '@brand/entities/brands.entity';
import { CategoryMappingService } from '@category/category-mapping.service';
import { CategoryService } from '@category/category.service';
import { CategoryMapping } from '@category/entities/categories-mapping.entity';
import { Category } from '@category/entities/categories.entity';
import { CategoryErrorMessages } from '@category/messages/category.error-messages';
import { CategoryMessagesLog } from '@category/messages/category.messages-log';
import { SavedImageDTO } from '@images/dto/saved-image.dto';
import { Image } from '@images/entites/images.entity';
import { ImageType } from '@images/enums/image-type.enum';
import { SubjectType } from '@images/enums/subject-type.enum';
import { ImageService } from '@images/image.service';
import { ImageErrorMessage } from '@images/messages/image.error-messages';
import { ImageMessageLog } from '@images/messages/image.messages-log';
import { ErrorMessage } from '@messages/error.messages';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PaginationResponse } from '@pagination/pagination-response';
import { CreateProductRequest } from '@product/dto/create-product-request.dto';
import { ProductFilterParams } from '@product/dto/filter-product-request.dto';
import { GetAllProductResponseDto } from '@product/dto/get-all-product-response.dto';
import { GetAllProductWithWishlistFlagWithUserIdDTO } from '@product/dto/get-all-product-with-wishlist-flag-with-user-id.dto';
import { GetProductDetailRequestDto } from '@product/dto/get-product-detail-request.dto';
import { GetProductDetailResponseDto } from '@product/dto/get-product-detail-response.dto';
import { UpdateProductInforRequestDTO } from '@product/dto/update-product-infor-request.dto';
import { ProductRating } from '@product/entites/product-rating.entity';
import { Product } from '@product/entites/products.entity';
import { ProductErrorMessage } from '@product/messages/product.error-messages';
import { ProductMessageLog } from '@product/messages/product.messages-log';
import { ProductRatingService } from '@product/product-rating.service';
import { ProductRepository } from '@product/repositories/product.repository';
import { UtilityService } from '@services/utility.service';
import { WishlistStatus } from '@wishlist/enums/wishlist-status.enum';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
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
    request: GetAllProductWithWishlistFlagWithUserIdDTO,
  ): Promise<PaginationResponse<GetAllProductResponseDto>> {
    // 1. Get pagination information
    const { skip, take } = this.utilityService.getPagination(
      request.page,
      request.limit,
    );

    // 2. Get product list
    const productList: PaginationResponse<Product> =
      await this.productRepo.getAllProductWithImageAndCategory(
        skip,
        take,
        request.userID,
      );

    // 3. Create Map for mapping image to product list
    const imageMap: Map<number, Image[]> = new Map();

    await Promise.all(
      productList.data.map(async (product) => {
        const images =
          await this.imageService.getImageListBySubjectIdAndSubjectType(
            product.id,
            SubjectType.PRODUCT,
          );
        imageMap.set(product.id, images);
      }),
    );

    // 4. Mapping product list to dto using plainToInstance
    const productDtos: GetAllProductResponseDto[] = await Promise.all(
      productList.data.map(async (product) => {
        // 4.1. Mapping to GetAllProductResponseDto
        const dto: GetAllProductResponseDto = await this.mapper.mapAsync(
          product,
          Product,
          GetAllProductResponseDto,
        );

        // 4.2. Mapping thumbnail url
        dto.thumbnailUrl = imageMap.get(product.id)?.[0].url ?? '';

        // 4.3. Check if user ID is provided
        if (request.userID) {
          dto.isInWishlist = product.wishlistMappings.some(
            (wm) =>
              wm.status === WishlistStatus.ACTIVE &&
              wm.wishlist?.status === WishlistStatus.ACTIVE &&
              wm.wishlist?.user?.id === request.userID,
          );
        } else {
          dto.isInWishlist = false;
        }

        return dto;
      }),
    );

    return {
      data: productDtos,
      meta: productList.meta,
    };
  }

  async findProductByName(
    name: string,
    limit: number,
    offset: number,
  ): Promise<PaginationResponse<GetAllProductResponseDto>> {
    // 1. Get pagination information
    const { skip, take } = this.utilityService.getPagination(offset, limit);

    // 2. Get product list
    const productList: PaginationResponse<Product> =
      await this.productRepo.findProductByName(name, skip, take);

    // 3. Create map for mapping image to product list
    const imageMap: Map<number, Image[]> = new Map();

    await Promise.all(
      productList.data.map(async (product) => {
        const images =
          await this.imageService.getImageListBySubjectIdAndSubjectType(
            product.id,
            SubjectType.PRODUCT,
          );
        imageMap.set(product.id, images);
      }),
    );

    // 4. Convert product list to dto using plainToInstance method
    const productDtos: GetAllProductResponseDto[] = await Promise.all(
      productList.data.map(async (product) => {
        const dto = await this.mapper.mapAsync(
          product,
          Product,
          GetAllProductResponseDto,
        );

        dto.thumbnailUrl = imageMap.get(product.id)?.[0].url ?? '';

        return dto;
      }),
    );

    return {
      data: productDtos,
      meta: productList.meta,
    };
  }

  async updateProductInfor(
    request: UpdateProductInforRequestDTO,
  ): Promise<Product> {
    // 1. Check product exist
    const product = await this.getProductByID(request.id);

    // 2. Get thumbnail image from product
    const thumbnailImage =
      await this.imageService.getImageBySubjectIdAndSubjectType(
        product.id,
        SubjectType.PRODUCT,
        ImageType.THUMBNAIL,
      );

    // 3. Get product images from product
    const productImages =
      await this.imageService.getImageListBySubjectIdAndSubjectType(
        product.id,
        SubjectType.PRODUCT,
        ImageType.PRODUCT,
      );

    // 3. Change image type to thumnnail
    if (request.mainImage.url !== thumbnailImage.url) {
      request.mainImage.type = ImageType.THUMBNAIL;
      // 3.1. Soft delete old image and save new thumbnail image information to db
      const newThumbnailImage: Image = await this.imageService.updateImage(
        thumbnailImage.id,
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

    // 4. Check request sub image exist
    if (request.subImages) {
      await this.updateProductImages(
        request.id,
        productImages,
        request.subImages,
      );
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
      brand.id,
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
      await this.categoryMappingService.findCategoryMappingListWithProductID(
        product.id,
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
      // 1. Get product detail
      const product: Product | null = await this.productRepo.getProductDetail(
        request.productID,
      );
      this.utilityService.logPretty('Product detail: ', product);

      // 2. Check product detail exist
      if (!product) {
        this.logger.warn(ProductMessageLog.PRODUCT_NOT_FOUND);
        throw new NotFoundException(ProductErrorMessage.PRODUCT_NOT_FOUND);
      }

      // 3. Get thumbnail image
      const thumbnailImage: Image =
        await this.imageService.getImageBySubjectIdAndSubjectType(
          product.id,
          SubjectType.PRODUCT,
          ImageType.THUMBNAIL,
        );
      this.utilityService.logPretty('Thumbnail image: ', thumbnailImage);

      // 4. Get product images
      const productImage: Image[] =
        await this.imageService.getImageListBySubjectIdAndSubjectType(
          request.productID,
          SubjectType.PRODUCT,
          ImageType.PRODUCT,
        );
      this.utilityService.logPretty('Product images: ', productImage);

      // 5. Get product rating
      const productRatingList: ProductRating[] =
        await this.productRatingService.getRatingByProductId(request.productID);
      this.utilityService.logPretty('Product rating: ', productRatingList);

      // 6. Calculate average rating
      const avgRating =
        productRatingList.length > 0
          ? productRatingList.reduce(
              (sum, rating) => sum + rating.starRated,
              0,
            ) / productRatingList.length
          : 0;
      this.utilityService.logPretty('Average rating: ', avgRating);

      // 7. Find category mapping list with product
      const categoryMappingList: CategoryMapping[] =
        await this.categoryMappingService.findCategoryMappingListWithProductID(
          product.id,
        );
      this.utilityService.logPretty(
        'Category mapping list: ',
        categoryMappingList,
      );

      // 8. Get brand by prouduct ID
      const brand: Brand = await this.brandService.getBrandById({
        id: product.brand.id,
      });
      this.utilityService.logPretty('Brand: ', brand);

      // 9. Mapping product detail response by using auto mapping
      const productDetailResponse: GetProductDetailResponseDto =
        this.mapper.map(product, Product, GetProductDetailResponseDto);

      // 10. Mapping manual to product detail response
      productDetailResponse.thumbnailUrl = thumbnailImage.url;
      productDetailResponse.imagesUrl = productImage.map((img) => img.url);
      productDetailResponse.starRated = avgRating;
      this.utilityService.logPretty('Raw response: ', productDetailResponse);

      // 11. Return product detail after mapping
      return productDetailResponse;
    } catch (error) {
      this.logger.error(`Error getting product detail: ${error}`);
      throw error;
    } finally {
      this.logger.log(`Get info with product id ${request.productID}`);
    }
  }

  async filterProducts(
    request: ProductFilterParams,
  ): Promise<PaginationResponse<GetAllProductResponseDto>> {
    // 1. Get pagination information
    const { skip, take } = this.utilityService.getPagination(
      request.page,
      request.limit,
    );
    this.logger.debug('Pagination - skip:', skip, 'take: ', take);

    // 2. Get product list
    const productList: PaginationResponse<Product> =
      await this.productRepo.filterProducts(request, skip, take);
    this.logger.debug('Product list: ', productList);

    // 3. Create map for mapping image to product list
    const imageMap: Map<number, Image> = new Map();
    this.logger.debug('Image map: ', imageMap);

    // 4. Get image for each product
    await Promise.all(
      productList.data.map(async (product) => {
        const images: Image =
          await this.imageService.getImageBySubjectIdAndSubjectType(
            product.id,
            SubjectType.PRODUCT,
            ImageType.THUMBNAIL,
          );
        imageMap.set(product.id, images);
      }),
    );

    // 5. Convert product list to dto
    const basedMap: GetAllProductResponseDto[] = this.mapper.mapArray(
      productList.data,
      Product,
      GetAllProductResponseDto,
    );

    // 6. Adding thumbnail url
    const response: GetAllProductResponseDto[] = basedMap.map((dto) => ({
      ...dto,
      thumbnailUrl: imageMap.get(dto.id)?.url ?? '',
    }));

    // 7. Return product list
    return {
      data: response,
      meta: productList.meta,
    };
  }

  async updateProductImages(
    productID: number,
    productImages: Image[],
    productImagesToSave: SavedImageDTO[],
  ): Promise<Image[]> {
    // 1. Get current url
    const currentUrls: string[] = productImages.map((img) => img.url).sort();
    this.logger.debug('Current urls: ', currentUrls);

    // 2. Get request url
    const requestUrls: string[] = productImagesToSave
      .map((img) => img.url)
      .sort();
    this.logger.debug('Request urls: ', requestUrls);

    // 3. Check difference between two array
    const isDifferent: boolean =
      currentUrls.length !== requestUrls.length ||
      currentUrls.some((url, index) => url !== requestUrls[index]);
    this.logger.debug('Is different: ', isDifferent);

    // 4. If two array is different
    if (!isDifferent) {
      // 4.1. Change image type to product
      productImagesToSave.forEach((image) => {
        image.type = ImageType.PRODUCT;
      });

      // 4.2. Get product image ids
      const productImageIds: number[] = productImages.map((img) => img.id);
      this.logger.debug('Product image ids: ', productImageIds);

      // 4.3. Remove product images
      const removeProductImagesResult: boolean =
        await this.imageService.removeImages(productImageIds);
      this.logger.debug(
        'Remove product images result: ',
        removeProductImagesResult,
      );

      // 4.4. Check remove product images result
      if (!removeProductImagesResult) {
        this.logger.warn(ImageMessageLog.CANNOT_REMOVE_IMAGES);
        throw new NotFoundException(ImageErrorMessage.CANNOT_UPDATE_IMAGE);
      }
    }

    // 5. Save sub image to db
    const newProductImages: Image[] = await this.imageService.saveImages(
      productImagesToSave,
      productID,
      SubjectType.PRODUCT,
    );
    this.logger.debug('New product images: ', newProductImages);

    // 6. Check save sub image result
    if (!newProductImages) {
      this.logger.warn(ImageMessageLog.CANNOT_UPDATE_IMAGE);
      throw new NotFoundException(ImageErrorMessage.CANNOT_UPDATE_IMAGE);
    }

    // 7. Return new sub image
    return newProductImages;
  }
}
