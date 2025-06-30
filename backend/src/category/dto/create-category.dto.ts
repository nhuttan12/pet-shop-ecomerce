import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ErrorMessage, SavedImageDTO } from '@common';

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
