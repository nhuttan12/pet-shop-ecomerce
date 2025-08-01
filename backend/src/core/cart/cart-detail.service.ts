import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { CartDetailResponse } from '@cart/dto/cart-detail/cart-detail-response.dto';
import { CreateCartDetailDto } from '@cart/dto/cart-detail/create-cart-detail.dto';
import { RemoveCartDetailDTO } from '@cart/dto/cart-detail/remove-cart-detail.dto';
import { CartDetail } from '@cart/entities/cart-details.entity';
import { CartDetailStatus } from '@cart/enums/cart-detail-status.enum';
import { CartStatus } from '@cart/enums/cart-status.enum';
import { CartErrorMessage } from '@cart/messages/cart.error-messages';
import { CartMessageLog } from '@cart/messages/cart.message-logs';
import { CartDetailRepository } from '@cart/repositories/cart-detail.repository';
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
export class CartDetailService {
  private readonly logger = new Logger(CartDetailService.name);
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly utilityService: UtilityService,
    private readonly cartDetailRepo: CartDetailRepository,
    private readonly productService: ProductService,
  ) {}

  async addProductToCartDetails(
    request: CreateCartDetailDto,
  ): Promise<CartDetail> {
    try {
      // 1. Add product to cart detail
      const cartDetail: CartDetail =
        await this.cartDetailRepo.addProductToCartDetails(request);
      this.utilityService.logPretty('Cart detail:', cartDetail);

      // 2. Check add product to cart detail result
      if (!cartDetail) {
        this.logger.error(CartMessageLog.ADD_PRODUCT_TO_CART_FAILED);
        throw new InternalServerErrorException(
          CartErrorMessage.ADD_PRODUCT_TO_CART_FAILED,
        );
      }

      return cartDetail;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async removeCartItem(
    request: RemoveCartDetailDTO,
  ): Promise<CartDetailResponse> {
    try {
      // 1. Get product by product id and check if product exist
      const product: Product = await this.productService.getProductByID(
        request.productID,
      );
      this.utilityService.logPretty('Get product by product id:', product);

      // 2. Remove cart item in cart
      const result: boolean = await this.cartDetailRepo.removeCartItem(
        request.cartID,
        product.id,
      );
      this.utilityService.logPretty('Remove cart item in cart', result);

      // 3. Check remove cart item result
      if (!result) {
        this.logger.error(CartMessageLog.REMOVE_CART_DETAIL_FAILED);
        throw new InternalServerErrorException(
          CartErrorMessage.REMOVE_CART_DETAIL_FAILED,
        );
      }

      // 4. Get cart detail after removed
      const cartDetail: CartDetail =
        await this.getCartDetailByProductIDAndCartID(
          product.id,
          request.cartID,
        );
      this.utilityService.logPretty(
        'Get cart detail after removed',
        cartDetail,
      );

      // 5. Check if cart detail exist
      if (!cartDetail) {
        this.logger.error(CartMessageLog.CART_CANNOT_BE_DELETED);
        throw new InternalServerErrorException(
          CartErrorMessage.REMOVE_CART_DETAIL_FAILED,
        );
      }

      // 6. Mapping cart detail to cart detail response
      const cartDetailResponse: CartDetailResponse = this.mapper.map(
        cartDetail,
        CartDetail,
        CartDetailResponse,
      );
      this.utilityService.logPretty(
        'Mapping cart detail to cart detail response',
        cartDetailResponse,
      );

      // 7. Return cart detail response after mapped
      return cartDetailResponse;
    } catch (error) {
      this.logger.error(`Error removing cart ID ${request.cartID}: ${error}`);
      throw error;
    } finally {
      this.logger.verbose(`Removing cart ID ${request.cartID} successfully`);
    }
  }

  async getCartDetailByProductIDAndCartID(
    productID: number,
    cartID: number,
  ): Promise<CartDetail> {
    // 1. Get cart detail
    const cartDetail: CartDetail | null =
      await this.cartDetailRepo.getCartDetailByProductIDAndCartID(
        productID,
        cartID,
      );
    this.utilityService.logPretty('Cart detail:', cartDetail);

    // 2. Check if cart detail exist
    if (!cartDetail) {
      this.logger.error(CartMessageLog.REMOVE_CART_DETAIL_FAILED);
      throw new InternalServerErrorException(
        CartErrorMessage.REMOVE_CART_DETAIL_FAILED,
      );
    }

    return cartDetail;
  }

  async getAllCartDetailPagingByUserID(
    userID: number,
    skip: number,
    take: number,
  ): Promise<PaginationResponse<CartDetail>> {
    try {
      // 1. Get cart details and meta data pagination
      const response: PaginationResponse<CartDetail> =
        await this.cartDetailRepo.getAllCartDetailPagingByUserID(
          userID,
          skip,
          take,
        );
      this.utilityService.logPretty('Cart details', response.data);
      this.utilityService.logPretty('Meta', response.meta);

      // 2. Response data and meta data
      return response;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async removeAllCartDetailByUserID(
    userID: number,
  ): Promise<CartDetailResponse[]> {
    try {
      // 1. Get all cart detail
      const cartDetailList: CartDetail[] = await this.getAllCartDetailByUserID(
        userID,
        CartStatus.ACTIVE,
        CartDetailStatus.ACTIVE,
      );
      this.utilityService.logPretty('Get all cart detail', cartDetailList);

      // 2. Remove all cart detail
      const removeAllCartDetailResult: boolean =
        await this.cartDetailRepo.removeAllCartDetailByUserIDAndCartID(
          userID,
          cartDetailList[0].cart.id,
        );
      this.utilityService.logPretty(
        'Remove all cart detail',
        removeAllCartDetailResult,
      );

      // 3. Check remove all cart detaul result
      if (!removeAllCartDetailResult) {
        this.logger.warn(CartMessageLog.REMOVE_CART_DETAIL_FAILED);
        throw new InternalServerErrorException(
          CartErrorMessage.REMOVE_CART_DETAIL_FAILED,
        );
      }

      // 4. Returning cart detail after removed
      const cartDetails: CartDetail[] = await this.getAllCartDetailByUserID(
        userID,
        CartStatus.REMOVED,
        CartDetailStatus.REMOVED,
      );
      this.utilityService.logPretty(
        'Returning cart detail after removed',
        cartDetails,
      );

      // 5. Mapping cart detail list cart detail response dto list
      const cartDetailsResponse: CartDetailResponse[] = this.mapper.mapArray(
        cartDetails,
        CartDetail,
        CartDetailResponse,
      );
      this.utilityService.logPretty(
        'Mapping cart detail list cart detail response dto list',
        cartDetailsResponse,
      );

      // 6. Returning cart detail response list after mapped
      return cartDetailsResponse;
    } catch (error) {
      this.logger.error('Error removing all cart detail', error);
      throw error;
    }
  }

  async getAllCartDetailByUserID(
    userID: number,
    cartStatus: CartStatus,
    cartDetailStatus: CartDetailStatus,
  ): Promise<CartDetail[]> {
    try {
      // 1. Get all cart detail by user id
      this.logger.verbose('Get all cart detail by user id');
      const cartDetailList: CartDetail[] =
        await this.cartDetailRepo.getAllCartDetailByUserID(
          userID,
          cartStatus,
          cartDetailStatus,
        );
      this.utilityService.logPretty(
        'Get all cart detail by user id',
        cartDetailList,
      );

      // 2. Return cart detail list
      this.logger.verbose('Return cart detail list');
      return cartDetailList;
    } catch (error) {
      this.logger.error('Error get all cart detail', error);
      throw error;
    }
  }

  async updateAllCartDetailStatusByUserID(
    userID: number,
    cartStatus: CartStatus,
    cartDetailStatus: CartDetailStatus,
  ): Promise<CartDetailResponse[]> {
    try {
      // 1. Get all cart detail
      this.logger.verbose('Get all cart detail');
      const cartDetailList: CartDetail[] = await this.getAllCartDetailByUserID(
        userID,
        cartStatus,
        CartDetailStatus.ACTIVE,
      );
      this.utilityService.logPretty('Get all cart detail', cartDetailList);

      // 2. Update all cart detail status to ordered
      this.logger.verbose('Update all cart detail status to ordered');
      const removeAllCartDetailResult: boolean =
        await this.cartDetailRepo.updateAllCartDetailStatusByUserIDAndCartID(
          userID,
          cartDetailList[0].cart.id,
          cartDetailStatus,
        );
      this.utilityService.logPretty(
        'Remove all cart detail',
        removeAllCartDetailResult,
      );

      // 3. Check remove all cart detaul result
      this.logger.verbose('Check remove all cart detaul result');
      if (!removeAllCartDetailResult) {
        this.logger.warn(CartMessageLog.REMOVE_CART_DETAIL_FAILED);
        throw new InternalServerErrorException(
          CartErrorMessage.REMOVE_CART_DETAIL_FAILED,
        );
      }

      // 4. Returning cart detail after removed
      this.logger.verbose('Returning cart detail after removed');
      const cartDetails: CartDetail[] = await this.getAllCartDetailByUserID(
        userID,
        CartStatus.ORDERED,
        CartDetailStatus.ORDERED,
      );
      this.utilityService.logPretty(
        'Returning cart detail after removed',
        cartDetails,
      );

      // 5. Mapping cart detail list cart detail response dto list
      this.logger.verbose(
        'Mapping cart detail list cart detail response dto list',
      );
      const cartDetailsResponse: CartDetailResponse[] = this.mapper.mapArray(
        cartDetails,
        CartDetail,
        CartDetailResponse,
      );
      this.utilityService.logPretty(
        'Mapping cart detail list cart detail response dto list',
        cartDetailsResponse,
      );

      // 6. Returning cart detail response list after mapped
      this.logger.verbose('Returning cart detail response list after mapped');
      return cartDetailsResponse;
    } catch (error) {
      this.logger.error('Error removing all cart detail', error);
      throw error;
    }
  }
}
