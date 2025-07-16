import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
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
import { WishlistMappingResponseDto } from '@wishlist/dto/wishlist-mapping-response.dto';
import { WishlistResponseDto } from '@wishlist/dto/wishlist-response.dto';
import { WishlistMapping } from '@wishlist/entities/wishlist-mapping.entity';
import { Wishlist } from '@wishlist/entities/wishlists.entity';
import { WishlistErrorMessage } from '@wishlist/messages/wishlist.error-messages';
import { WishlistMessageLog } from '@wishlist/messages/wishlist.message-logs';
import { WishlistMappingRepository } from '@wishlist/repositories/wishlist-mapping.repository';
import { WishlistService } from '@wishlist/wishlist.service';

@Injectable()
export class WishListMappingService {
  private readonly logger = new Logger(WishListMappingService.name);
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
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

      // 6. Map wishlist mapping array to wishlist mapping response array
      const mappedList: WishlistMappingResponseDto[] = this.mapper.mapArray(
        wishlistMappingList.data,
        WishlistMapping,
        WishlistMappingResponseDto,
      );

      // 7. Add thumbnail url
      for (const item of mappedList) {
        const original = wishlistMappingList.data.find(
          (x) => x.wishlist.id === item.id,
        );
        if (original) {
          const images = imageMap.get(original.product.id);
          item.thumbnailUrl = images?.[0]?.url ?? '';
        }
      }

      // 8. Returniong mapped list and pagination meta
      return {
        data: mappedList,
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

  async removeWishList(
    productID: number,
    userID: number,
  ): Promise<WishlistResponseDto> {
    try {
      // 1. Get wishlist by user id
      const wishlist: Wishlist | null =
        await this.wishlistService.getWishtListByUserID(userID);
      this.utilityService.logPretty('Get wishlist by user id: ', wishlist);

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
      this.utilityService.logPretty('Remove wishlist result:', result);

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
