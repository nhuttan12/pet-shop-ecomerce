import { SavedImageDTO } from '@images/dto/saved-image.dto';
import { ErrorMessage } from '@messages/error.messages';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';

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
