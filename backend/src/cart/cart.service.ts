import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { Cart, CartDetail, CartInsert } from '@schema-type';
import { cartDetails, carts, images, productImages, products } from '@schema';
import { CartDetailResponse } from '@dtos/cart-detail/cart-detail-response.dto';
import { CreateCartDetailDto } from '@dtos/cart-detail/create-cart-detail.dto';
import { GetAllCartsDTO } from '@dtos/cart/get-all-cart.dto';
import { RemoveCartDTO } from '@dtos/cart/remove-cart.dto';
import { CartDetailStatus } from '@enum/status/cart-detail-status.enum';
import { CartStatus } from '@enum/status/cart-status.enum';
import { ProductStatus } from '@enum/status/product-status.enum';
import { ErrorMessage } from '@message/error-message';
import { MessageLog } from '@message/message-log';
import { DrizzleAsyncProvider } from '@helper-modules/database/drizzle.provider';
import { ConvertToEnum } from '@helper-modules/services/convert-to-enum.service';
import { SearchService } from '@helper-modules/services/search.service';
import { UpdateService } from '@helper-modules/services/update.service';
import { ProductService } from '@core-modules/product/product/product.service';
import { UtilityService } from '@helper-modules/services/utility.service';

@Injectable()
export class CartService {
  private readonly logger = new Logger();
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: MySql2Database<any>,
    private searchService: SearchService,
    private convertToEnum: ConvertToEnum,
    private updateService: UpdateService,
    private productService: ProductService,
    private utilityService: UtilityService,
  ) {}

  async getAllCarts({ limit, page }: GetAllCartsDTO): Promise<Cart[]> {
    const { skip, take } = this.utilityService.getPagination(page, limit);
    this.logger.debug(`Pagination - skip: ${skip}, take: ${take}`);

    return await this.searchService.findManyOrReturnEmptyArray<Cart, any>(
      this.db,
      carts,
      eq(carts.status, CartStatus.ACTIVE),
      take,
      skip,
    );
  }

  async getCartsById(id: number): Promise<Cart> {
    return await this.searchService.findOneOrThrow(
      this.db,
      carts,
      eq(carts.id, id),
    );
  }

  async addToCart(
    userId: number,
    productId: number,
    quantity: number = 1,
  ): Promise<Cart> {
    // 1. find active cart of current user
    let [cart] = await this.db
      .select()
      .from(carts)
      .where(and(eq(carts.userId, userId), eq(carts.status, CartStatus.ACTIVE)))
      .limit(1);

    if (!cart) {
      cart = await this.insertCart(userId); // gọi hàm insertCart như bạn đã viết
    }

    const [cartDetail] = await this.db
      .select()
      .from(cartDetails)
      .innerJoin(carts, eq(carts.id, cartDetails.cartId))
      .where(
        and(
          eq(cartDetails.productId, productId),
          eq(cartDetails.status, CartStatus.ACTIVE),
          eq(carts.userId, userId),
        ),
      );

    if (!cartDetail) {
      const product = await this.productService.getProductById(productId);

      await this.createCartDetail({
        cartId: cart.id,
        productId,
        quantity,
        price: product.price,
        status: CartDetailStatus.ACTIVE,
      });
    }

    return cart;
  }

  async insertCart(userId: number): Promise<Cart> {
    try {
      const value: CartInsert = {
        userId: userId,
        created_at: new Date(),
        updated_at: new Date(),
        status: CartStatus.ACTIVE,
      };
      this.logger.debug(`Value ${JSON.stringify(value)}`);

      const [cartCreatedId]: { id: number }[] = await this.db.transaction(
        (tx) => {
          return tx.insert(carts).values(value).$returningId();
        },
      );

      if (!cartCreatedId) {
        this.logger.error(MessageLog.CART_NOT_FOUND);
        throw new InternalServerErrorException(
          ErrorMessage.INTERNAL_SERVER_ERROR,
        );
      }

      return await this.searchService.findOneOrThrow<Cart>(
        this.db,
        carts,
        eq(carts.id, cartCreatedId.id),
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    } catch (error) {
      this.logger.error(`Error: ${error}`);
      throw error;
    } finally {
      this.logger.verbose(`Adding cart for ${userId} successfully`);
    }
  }

  async removeCart({ cartId }: RemoveCartDTO): Promise<Cart> {
    try {
      const result = await this.db.transaction((tx) =>
        tx
          .update(carts)
          .set({ status: CartStatus.REMOVED, updated_at: new Date() })
          .where(eq(carts.id, cartId)),
      );

      this.logger.debug(`Delete result: ${JSON.stringify(result)}`);

      if (!result) {
        this.logger.error(MessageLog.CART_CANNOT_BE_DELETED);
        throw new InternalServerErrorException(ErrorMessage.CART_NOT_FOUND);
      }

      return this.getCartsById(cartId);
    } catch (error) {
      this.logger.error(`Error removing cart ID ${cartId}: ${error}`);
      throw error;
    } finally {
      this.logger.verbose(`Removing cart ID ${cartId} successfully`);
    }
  }

  async getCartDetailByCartId(
    cartId: number,
    limit: number = 10,
    offset: number = 0,
  ): Promise<CartDetailResponse[]> {
    const { skip, take } = this.utilityService.getPagination(offset, limit);
    try {
      const details = await this.db
        .select({
          cartDetailId: cartDetails.id,
          quantity: cartDetails.quantity,
          price: cartDetails.price,
          cartDetailStatus: cartDetails.status,
          productId: products.id,
          productName: products.name,
          productPrice: products.price,
          productStocking: products.stocking,
          productStatus: products.status,
          // imageUrl: this.db.raw('MAX(images.url)'),
          imageUrl: images.url,
        })
        .from(cartDetails)
        .innerJoin(products, eq(cartDetails.productId, products.id))
        .leftJoin(productImages, eq(productImages.productId, products.id))
        .leftJoin(images, eq(productImages.imageId, images.id))
        .where(
          and(
            eq(cartDetails.cartId, cartId),
            eq(cartDetails.status, CartDetailStatus.ACTIVE),
          ),
        )
        .limit(take)
        .offset(skip)
        .groupBy(cartDetails.id);

      const result: CartDetailResponse[] = details.map((item) => ({
        ...item,
        cartDetailStatus: this.convertToEnum.toEnumValue(
          CartDetailStatus,
          item.cartDetailStatus,
        ),
        productStatus: this.convertToEnum.toEnumValue(
          ProductStatus,
          item.productStatus,
        ),
      }));

      return result;
    } catch (error) {
      this.logger.error(`Error ${error}`);
      throw error;
    } finally {
      this.logger.log(`Get cart detail by cart id: ${cartId}`);
    }
  }

  async removeCartDetailById(id: number): Promise<CartDetail> {
    try {
      await this.updateService.updateOrThrowError(
        this.db,
        cartDetails,
        { status: CartDetailStatus.REMOVED, updated_at: new Date() },
        eq(cartDetails.id, id),
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );

      return this.searchService.findOneOrThrow(
        this.db,
        cartDetails,
        eq(cartDetails.id, id),
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async createCartDetail({
    cartId,
    price,
    productId,
    quantity,
    status,
  }: CreateCartDetailDto): Promise<CartDetail> {
    try {
      const [inserted] = await this.db.transaction((tx) => {
        return tx
          .insert(cartDetails)
          .values({
            cartId,
            productId,
            quantity,
            price,
            status,
          })
          .$returningId();
      });

      return await this.searchService.findOneOrThrow(
        this.db,
        cartDetails,
        eq(cartDetails.id, inserted.id),
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
