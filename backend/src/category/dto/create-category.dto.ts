import { SavedImageDTO } from '@dtos/image/saved-image.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ErrorMessage } from '@message/error-message';
import { Type } from 'class-transformer';

export class CategoryCreateDTO {
  @IsString({ message: ErrorMessage.NAME_MUST_BE_STRING })
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => SavedImageDTO)
  savedImageDTO: SavedImageDTO;
}
