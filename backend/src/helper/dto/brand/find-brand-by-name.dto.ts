import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { NotUrlValidator } from 'src/helper/class-validator-contraint/not-url.validator';
import { ErrorMessage } from 'src/helper/message/error-message';

export class FindBrandByName {
  @IsString({ message: ErrorMessage.BRAND_FULL_NAME_MUST_BE_STRING })
  @Validate(NotUrlValidator)
  @IsNotEmpty()
  @ApiProperty()
  name: string;
}
