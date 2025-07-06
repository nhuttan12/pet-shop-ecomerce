import {
  CartDetail,
  CartDetailRepository,
  CartErrorMessage,
  CartMessageLog,
  CreateCartDetailDto,
  RemoveCartDetailDTO
} from '@cart';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Product, ProductService } from '@product';

@Injectable()
export class CartDetailService {
  private readonly logger = new Logger(CartDetailService.name);
  constructor(
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
      this.logger.debug(`Cart detail: ${JSON.stringify(cartDetail)}`);

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

  async removeCartItem(request: RemoveCartDetailDTO): Promise<CartDetail> {
    try {
      // 1. Get product by product id and check if product exist
      const product: Product = await this.productService.getProductByID(
        request.productID,
      );
      this.logger.debug(`Product: ${JSON.stringify(product)}`);

      // 2. Remove cart item in cart
      const result: boolean = await this.cartDetailRepo.removeCartItem(
        request.cartID,
        product.id,
      );
      this.logger.debug(`Delete result: ${JSON.stringify(result)}`);

      // 3. Check remove cart item result
      if (!result) {
        this.logger.error(CartMessageLog.REMOVE_CART_DETAIL_FAILED);
        throw new InternalServerErrorException(
          CartErrorMessage.REMOVE_CART_DETAIL_FAILED,
        );
      }

      return this.getCartDetailByProductIDAndCartID(product.id, request.cartID);
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
    this.logger.debug(`Cart detail: ${JSON.stringify(cartDetail)}`);

    // 2. Check if cart detail exist
    if (!cartDetail) {
      this.logger.error(CartMessageLog.REMOVE_CART_DETAIL_FAILED);
      throw new InternalServerErrorException(
        CartErrorMessage.REMOVE_CART_DETAIL_FAILED,
      );
    }

    return cartDetail;
  }

  async getAllCartDetailByUserID(
    userID: number,
    skip: number,
    take: number,
  ): Promise<CartDetail[]> {
    return this.cartDetailRepo.getAllCartDetailByUserID(userID, skip, take);
  }
}
