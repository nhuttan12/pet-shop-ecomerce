import { SavedImageDTO } from 'src/helper/dto/image/saved-image.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ErrorMessage } from 'src/helper/message/error-message';

export class CategoryCreateDTO {
  @IsString({ message: ErrorMessage.NAME_MUST_BE_STRING })
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  savedImageDTO: SavedImageDTO;
}
