import { Image } from '@images/entites/images.entity';
import { SubjectType } from '@images/enums/subject-type.enum';
import { ImageService } from '@images/image.service';
import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PaginationResponse } from '@pagination/pagination-response';
import { UtilityService } from '@services/utility.service';
import { GetAllWishListMappingDTO } from '@wishlist/dto/get-all-wishlist-mapping-request.dto';
import { WishlistMappingResponseDto } from '@wishlist/dto/wishlist-response.dto';
import { WishlistMapping } from '@wishlist/entities/wishlist-mapping.entity';
import { Wishlist } from '@wishlist/entities/wishlists.entity';
import { WishlistErrorMessage } from '@wishlist/messages/wishlist.error-messages';
import { WishlistMessageLog } from '@wishlist/messages/wishlist.message-logs';
import { WishlistMappingRepository } from '@wishlist/repositories/wishlist-mapping.repository';
import { WishlistService } from '@wishlist/wishlist.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class WishListMappingService {
  private readonly logger = new Logger(WishListMappingService.name);
  constructor(
    private readonly wishlistMappingRepo: WishlistMappingRepository,
    @Inject(forwardRef(() => WishlistService))
    private readonly wishlistService: WishlistService,
    private readonly utilityService: UtilityService,
    private readonly imageService: ImageService,
  ) {}

  async getAllWishListMappingByUserID(
    request: GetAllWishListMappingDTO,
  ): Promise<PaginationResponse<WishlistMappingResponseDto>> {
    try {
      // 1. Get pagination information
      const { skip, take } = this.utilityService.getPagination(
        request.page,
        request.limit,
      );
      this.logger.debug(`Pagination - skip: ${skip}, take: ${take}`);

      // 2. Get wishlist mapping list by wishlist id
      const wishlistMappingList: PaginationResponse<WishlistMapping> =
        await this.wishlistMappingRepo.getAllWishlistMappingByUserID(
          request.userID,
          skip,
          take,
        );
      this.logger.debug('Wishlist mapping list: ', wishlistMappingList);

      // 3. Get product id list
      const productIDs: number[] = wishlistMappingList.data.map((wishlist) => {
        return wishlist.product.id;
      });
      this.logger.debug('Product id list: ', productIDs);

      // 4. Create image map
      const imageMap = new Map<number, Image[]>();
      this.logger.debug('Image map: ', imageMap);

      // 5. Get image list product id list
      for (const productId of productIDs) {
        const images =
          await this.imageService.getImageListBySubjectIdAndSubjectType(
            productId,
            SubjectType.PRODUCT,
          );
        this.logger.debug('Image', images);

        imageMap.set(productId, images);
      }

      // 6. Return wishlist mapping list
      const result: WishlistMappingResponseDto[] = wishlistMappingList.data.map(
        (wishlistMapping) => ({
          id: wishlistMapping.wishlist.id,
          userID: wishlistMapping.wishlist.user.id,
          productName: wishlistMapping.product.name,
          productPrice: wishlistMapping.product.price,
          brandName: wishlistMapping.product.brand.name,
          categoryName:
            wishlistMapping.product.categoriesMapping[0].category.name,
          status: wishlistMapping.product.status,
          thumbnailUrl: (imageMap.get(wishlistMapping.product.id) || [])[0].url,
          stock: wishlistMapping.product.stocking,
          createdAt: wishlistMapping.createdAt,
          updatedAt: wishlistMapping.updatedAt,
        }),
      );

      // 7. Cast wishlist mapping response
      const response: WishlistMappingResponseDto[] = plainToInstance(
        WishlistMappingResponseDto,
        result,
        {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        },
      );

      return {
        data: response,
        meta: wishlistMappingList.meta,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async createWishlistMapping(
    wishlistID: number,
    productID: number,
  ): Promise<WishlistMapping> {
    return await this.wishlistMappingRepo.createWishlistMapping(
      wishlistID,
      productID,
    );
  }

  async removeWishList(productID: number, userID: number): Promise<Wishlist> {
    try {
      // 1. Get wishlist by user id
      const wishlist: Wishlist | null =
        await this.wishlistService.getWishtListByUserID(userID);

      // 2. Check wishlist exist
      if (!wishlist) {
        this.logger.warn(WishlistMessageLog.WISHLIST_NOT_FOUND);
        throw new NotFoundException(WishlistErrorMessage.WISHLIST_NOT_FOUND);
      }

      // 3. Remove wishlist mapping
      const result = await this.wishlistMappingRepo.removeWishlistMapping(
        userID,
        productID,
      );

      // 4. Check removing wishlist mapping result
      if (!result) {
        this.logger.error(WishlistErrorMessage.WISHLIST_NOT_FOUND);
        throw new ConflictException(WishlistErrorMessage.WISHLIST_NOT_FOUND);
      }

      // 5. Return wishlist and wishlist mapping
      return this.wishlistService.getWishlistAndWishlistMappingByUserID(userID);
    } catch (error) {
      this.logger.error(error);
      throw error;
    } finally {
      this.logger.log(`Update wishlist: ${productID} and user: ${userID}`);
    }
  }
}
