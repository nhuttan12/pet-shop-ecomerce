import { ErrorMessage } from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

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
}
