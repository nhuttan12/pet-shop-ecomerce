import { AutoMap } from '@automapper/classes';
import { CartDetailResponse } from '@cart/dto/cart-detail/cart-detail-response.dto';
import { CartStatus } from '@cart/enums/cart-status.enum';

export class CartResponseDto {
  @AutoMap()
  id: number;

  @AutoMap()
  userID: number;

  @AutoMap()
  userName: string;

  @AutoMap()
  status: CartStatus;

  @AutoMap()
  createdAt: Date;

  @AutoMap()
  updatedAt: Date;

  @AutoMap()
  cartDetails: CartDetailResponse[];
}
