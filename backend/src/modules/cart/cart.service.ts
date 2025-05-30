import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { Cart, CartInsert } from 'src/db/helper/schema-type';
import { carts } from 'src/db/schema';
import { CartCreateDTO } from 'src/helper/dto/cart/create-cart.dto';
import { GetAllCartsDTO } from 'src/helper/dto/cart/get-all-cart.dto';
import { RemoveCartDTO } from 'src/helper/dto/cart/remove-cart.dto';
import { CartStatus } from 'src/helper/enum/status/cart-status.enum';
import { ErrorMessage } from 'src/helper/message/error-message';
import { MessageLog } from 'src/helper/message/message-log';
import { SearchService } from 'src/helper/services/search.service';
import { DrizzleAsyncProvider } from '../database/drizzle.provider';

@Injectable()
export class CartService {
  private readonly logger = new Logger();
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: MySql2Database<any>,
    private searchService: SearchService,
  ) {}

  async getAllCarts({ limit, page }: GetAllCartsDTO): Promise<Cart[]> {
    const offset = Math.max(0, page - 1);
    this.logger.debug(`Pagination - limit: ${limit}, offset: ${offset}`);

    return await this.searchService.findManyOrReturnEmptyArray<Cart, any>(
      this.db,
      carts,
      undefined,
      limit,
      offset,
    );
  }

  async getCartsById(id: number): Promise<Cart> {
    return await this.searchService.findOneOrThrow(
      this.db,
      carts,
      eq(carts.id, id),
    );
  }

  async insertCart({ userId }: CartCreateDTO): Promise<Cart> {
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
          .set({ status: CartStatus.REMOVED })
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
}
