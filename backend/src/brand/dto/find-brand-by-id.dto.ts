import { BrandErrorMessages } from '@brand/messages/brand.error-messages';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindBrandById {
  @IsInt({ message: BrandErrorMessages.BRAND_ID_MUST_BE_INTEGER })
  @Min(1)
  @IsNotEmpty()
  @ApiProperty()
  id: number;
}
