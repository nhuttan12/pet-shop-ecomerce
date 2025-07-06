import {
  Cart,
  GetAllCartsDTO,
  CartRepository,
  CartErrorMessage,
  CartMessageLog,
  CartDetailService,
  CartDetailResponse,
  CartDetail,
} from '@cart';
import { Image, ImageService, SubjectType, UtilityService } from '@common';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Product, ProductService } from '@product';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CartService {
  private readonly logger = new Logger();
  constructor(
    private readonly productService: ProductService,
    private readonly utilityService: UtilityService,
    private readonly cartRepo: CartRepository,
    private readonly cartDetailService: CartDetailService,
    private readonly imageService: ImageService,
  ) {}

  async getAllCartItemsByUserID(
    request: GetAllCartsDTO,
    userID: number,
  ): Promise<CartDetailResponse[]> {
    // 1. Get pagination information
    const { skip, take } = this.utilityService.getPagination(
      request.page,
      request.limit,
    );
    this.logger.debug(`Pagination - skip: ${skip}, take: ${take}`);

    // 2. Get cart items
    const cartDetails: CartDetail[] =
      await this.cartDetailService.getAllCartDetailByUserID(userID, skip, take);
    this.logger.debug(`Carts: ${JSON.stringify(cartDetails)}`);

    // 3. Plattern all cart items
    const detailDtos: CartDetailResponse[] = await Promise.all(
      // 3.1. Mapping through cart items
      cartDetails.map(async (detail): Promise<CartDetailResponse> => {
        // 3.1.1. Get thumbnail image
        const thumbnail: Image =
          await this.imageService.getImageBySubjectIdAndSubjectType(
            detail.product.id,
            SubjectType.PRODUCT,
          );

        // 3.1.2. Return cart detail with product
        return {
          cartDetailID: detail.id,
          quantity: detail.quantity,
          price: detail.price,
          cartDetailStatus: detail.status,
          productID: detail.product.id,
          productName: detail.product.name,
          productPrice: detail.product.price,
          productStocking: detail.product.stocking,
          productStatus: detail.product.status,
          imageUrl: thumbnail.url,
        };
      }),
    );

    // 4. Return cart details response with plain to instance
    return plainToInstance(CartDetailResponse, detailDtos, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  async getCartByUserID(cartID: number): Promise<Cart | null> {
    return await this.cartRepo.getCartByUserID(cartID);
  }

  async addToCart(
    userID: number,
    productID: number,
    quantity: number = 1,
  ): Promise<Cart> {
    // 1. Find active cart of current user
    let cart: Cart | null = await this.getCartByUserID(userID);

    // 2. Check if cart exists
    if (!cart) {
      cart = await this.cartRepo.createCart(userID);

      // 2.1 Check if cart is created
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

    // 4. Check if cart with cart detail exist
    if (!cartWithCartDetail) {
      const product: Product =
        await this.productService.getProductByID(productID);

      // 4.1. Add product to cart detail
      await this.cartDetailService.addProductToCartDetails({
        cartId: cart.id,
        productId: product.id,
        quantity,
        price: product.price,
      });
    }

    return cart;
  }
}
