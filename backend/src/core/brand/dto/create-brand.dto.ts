import { IsNotEmpty, IsString } from 'class-validator';
import { BrandErrorMessages } from '@brand/messages/brand.error-messages';
import { ApiProperty } from '@nestjs/swagger';

export class BrandCreateDTO {
  @IsString({ message: BrandErrorMessages.BRAND_NAME_MUST_BE_STRING })
  @IsNotEmpty()
  @ApiProperty()
  name: string;
}
