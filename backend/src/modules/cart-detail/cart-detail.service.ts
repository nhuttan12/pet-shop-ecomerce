import { Inject, Injectable, Logger } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { CartDetail } from 'src/db/helper/schema-type';
import { images, productImages, products } from 'src/db/schema';
import { CreateCartDetailDto } from 'src/helper/dto/cart-detail/create-cart-detail.dto';
import { CartDetailResponse } from 'src/helper/dto/cart-detail/cart-detail-response.dto';
import { CartDetailStatus } from 'src/helper/enum/status/cart-detail-status.enum';
import { ProductStatus } from 'src/helper/enum/status/product-status.enum';
import { ErrorMessage } from 'src/helper/message/error-message';
import { SearchService } from 'src/helper/services/search.service';
import { UpdateService } from 'src/helper/services/update.service';
import { DrizzleAsyncProvider } from '../database/drizzle.provider';
import { cartDetails } from './../../db/schema/cart-details.schema';
import { ConvertToEnum } from './../../helper/services/convert-to-enum.service';

@Injectable()
export class CartDetailService {
  private readonly logger = new Logger(CartDetailService.name);

  constructor(
    @Inject(DrizzleAsyncProvider) private db: MySql2Database<any>,
    private searchService: SearchService,
    private convertToEnum: ConvertToEnum,
    private updateService: UpdateService,
  ) {}

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

  async getCartDetailByCartId(
    cartId: number,
    limit: number,
    offset: number,
  ): Promise<CartDetailResponse[]> {
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
        .limit(limit)
        .offset(offset)
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

  async remove(id: number): Promise<CartDetail> {
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
}
