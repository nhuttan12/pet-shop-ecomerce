import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { CartDetailService } from '@cart/cart-detail.service';
import { CartDetailResponse } from '@cart/dto/cart-detail/cart-detail-response.dto';
import { CartResponseDto } from '@cart/dto/cart/cart-response.dto';
import { GetAllCartsDTO } from '@cart/dto/cart/get-all-cart.dto';
import { CartDetail } from '@cart/entities/cart-details.entity';
import { Cart } from '@cart/entities/carts.entity';
import { CartStatus } from '@cart/enums/cart-status.enum';
import { CartErrorMessage } from '@cart/messages/cart.error-messages';
import { CartMessageLog } from '@cart/messages/cart.message-logs';
import { CartRepository } from '@cart/repositories/cart.repository';
import { ImageType } from '@images/enums/image-type.enum';
import { SubjectType } from '@images/enums/subject-type.enum';
import { ImageService } from '@images/image.service';
import { ErrorMessage } from '@messages/error.messages';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PaginationResponse } from '@pagination/pagination-response';
import { Product } from '@product/entites/products.entity';
import { ProductService } from '@product/product.service';
import { UtilityService } from '@services/utility.service';

@Injectable()
export class CartService {
  private readonly logger = new Logger();
  constructor(
    @InjectMapper()
    private readonly mapper: Mapper,
    private readonly productService: ProductService,
    private readonly utilityService: UtilityService,
    private readonly cartRepo: CartRepository,
    private readonly cartDetailService: CartDetailService,
    private readonly imageService: ImageService,
  ) {}

  async getAllCartItemsByUserID(
    request: GetAllCartsDTO,
    userID: number,
  ): Promise<PaginationResponse<CartDetailResponse>> {
    // 1. Get pagination information
    const { skip, take } = this.utilityService.getPagination(
      request.page,
      request.limit,
    );
    this.logger.debug(`Pagination - skip: ${skip}, take: ${take}`);

    // 2. Get cart items
    const cartDetails: PaginationResponse<CartDetail> =
      await this.cartDetailService.getAllCartDetailPagingByUserID(
        userID,
        skip,
        take,
      );
    this.utilityService.logPretty('Cart detail list:', cartDetails.data);
    this.utilityService.logPretty(
      'Cart detail meta data pagination',
      cartDetails.meta,
    );

    // 3. Map cart detail to cart detail response
    const cartDetailResponse: CartDetailResponse[] = this.mapper.mapArray(
      cartDetails.data,
      CartDetail,
      CartDetailResponse,
    );
    this.utilityService.logPretty('Cart detail response:', cartDetailResponse);

    // 4. Get thumbnail image for each cart detail
    await Promise.all(
      cartDetailResponse.map(async (detail, i) => {
        const thumbnail =
          await this.imageService.getImageBySubjectIdAndSubjectType(
            cartDetails.data[i].product.id,
            SubjectType.PRODUCT,
            ImageType.THUMBNAIL,
          );
        this.utilityService.logPretty('Thumbnail:', thumbnail);
        detail.imageUrl = thumbnail?.url;
      }),
    );
    this.utilityService.logPretty(
      'Cart detail response after add thumbnail:',
      cartDetailResponse,
    );

    // 5. Return cart detail list and meta pagination
    return {
      data: cartDetailResponse,
      meta: cartDetails.meta,
    };
  }

  async getCartByUserID(userID: number): Promise<Cart | null> {
    return await this.cartRepo.getCartByUserID(userID);
  }

  async getCartByUserIDAndStatus(
    userID: number,
    status: CartStatus,
  ): Promise<Cart> {
    // 1. Get cart by user ID and cart status
    const cart = await this.cartRepo.getCartByUserIDAndStatus(userID, status);
    this.utilityService.logPretty('Get cart by user ID and cart status:', cart);

    // 2. Check if cart exist
    if (!cart) {
      this.logger.error(CartMessageLog.CART_NOT_FOUND);
      throw new InternalServerErrorException(CartErrorMessage.CART_NOT_FOUND);
    }

    // 3. Return cart after check
    return cart;
  }

  async addToCart(
    userID: number,
    productID: number,
    quantity: number = 1,
  ): Promise<CartResponseDto> {
    // 1. Find active cart of current user
    let cart: Cart | null = await this.getCartByUserID(userID);
    this.utilityService.logPretty('Find active cart of current user', cart);

    // 2. Check if cart exists
    if (!cart) {
      // 2.1. Create new cart
      cart = await this.cartRepo.createCart(userID);
      this.utilityService.logPretty('Create new cart:', cart);

      // 2.2. Check if cart is created
      if (!cart) {
        this.logger.error(CartMessageLog.CART_NOT_FOUND);
        throw new InternalServerErrorException(
          CartErrorMessage.ADD_PRODUCT_TO_CART_FAILED,
        );
      }
    }

    // 3. Get cart with cart detail
    const cartWithCartDetail =
      await this.cartRepo.getCartAndCartItemsByProductIDAndUserID(
        productID,
        userID,
      );
    this.utilityService.logPretty('Cart with cart detail:', cartWithCartDetail);

    // 4. Check if cart with cart detail exist
    if (!cartWithCartDetail) {
      // 4.1. Get product by product ID
      const product: Product =
        await this.productService.getProductByID(productID);
      this.utilityService.logPretty('Product:', product);

      // 4.2. Add product to cart detail
      const cartDetail: CartDetail =
        await this.cartDetailService.addProductToCartDetails({
          cartId: cart.id,
          productId: product.id,
          quantity,
          price: product.price,
        });
      this.utilityService.logPretty('Cart detail:', cartDetail);
    }

    // 5. Mapping cart to cart reponse dto
    const cartResponseDto = this.mapper.map(cart, Cart, CartResponseDto);
    this.utilityService.logPretty(
      'Mapping cart to cart reponse dto:',
      cartResponseDto,
    );

    // 6. Return cart after mapping
    return cartResponseDto;
  }

  async updateCartStatus(cartID: number, status: CartStatus): Promise<boolean> {
    // 1. Update cart status
    const result = await this.cartRepo.updateCartStatus(cartID, status);
    this.logger.debug('Update cart status result:', result);

    // 2. Check update result
    if (!result) {
      this.logger.error(CartMessageLog.UPDATE_CART_STATUS_FAILED);
      throw new InternalServerErrorException(
        CartErrorMessage.UPDATE_CART_STATUS_FAILED,
      );
    }

    // 3. Return result
    return result;
  }

  async removeCartByUserID(userID: number): Promise<CartResponseDto> {
    try {
      // 1. Remove cart by user ID
      const removeCartByUserIDResult: boolean =
        await this.cartRepo.removeCartByUserID(userID);
      this.utilityService.logPretty(
        'Remove cart by user ID result:',
        removeCartByUserIDResult,
      );

      // 2. Check remove cart by user ID result
      if (!removeCartByUserIDResult) {
        this.logger.error(CartMessageLog.REMOVE_CART_FAILED);
        throw new InternalServerErrorException(
          ErrorMessage.INTERNAL_SERVER_ERROR,
        );
      }

      // 3. Get cart after removed with user ID
      const cart: Cart | null = await this.getCartByUserIDAndStatus(
        userID,
        CartStatus.REMOVED,
      );
      this.utilityService.logPretty('Cart after removed:', cart);

      // 4. Check if cart exist
      if (!cart) {
        this.logger.error(CartMessageLog.CART_NOT_FOUND);
        throw new InternalServerErrorException(CartErrorMessage.CART_NOT_FOUND);
      }

      // 5. Mapping cart to cart reponse dto
      const cartResponse = this.mapper.map(cart, Cart, CartResponseDto);
      this.utilityService.logPretty(
        'Cart response after remove:',
        cartResponse,
      );

      // 6. Return cart response dto
      return cartResponse;
    } catch (error) {
      this.logger.error('Error in remove cart by user ID', error);
      throw error;
    }
  }
}
