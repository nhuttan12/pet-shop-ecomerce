import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, Min } from 'class-validator';
import { CartDetailStatus } from '@enum/status/cart-detail-status.enum';
import { ErrorMessage } from '@message/error-message';

export class CreateCartDetailDto {
  @IsInt({ message: ErrorMessage.ID_MUST_BE_INTEGER })
  @IsNotEmpty()
  @Min(1)
  @ApiProperty()
  cartId: number;

  @IsInt({ message: ErrorMessage.ID_MUST_BE_INTEGER })
  @IsNotEmpty()
  @Min(1)
  @ApiProperty()
  productId: number;

  @IsInt({ message: ErrorMessage.ID_MUST_BE_INTEGER })
  @IsNotEmpty()
  @Min(1)
  @ApiProperty()
  quantity: number;

  @IsInt({ message: ErrorMessage.ID_MUST_BE_INTEGER })
  @IsNotEmpty()
  @Min(1)
  @ApiProperty()
  price: number;

  @IsEnum({ message: ErrorMessage.ID_MUST_BE_INTEGER })
  @IsNotEmpty()
  @ApiProperty()
  status: CartDetailStatus = CartDetailStatus.ACTIVE;
}
