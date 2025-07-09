import { NotUrlValidator } from '@class-validator/not-url.validator';
import { ImageType } from '@images/enums/image-type.enum';
import { ErrorMessage } from '@messages/error.messages';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Validate, IsOptional, IsEnum } from 'class-validator';

export class SavedImageDTO {
  @ApiProperty({
    description: 'URL đầy đủ của ảnh đã được lưu',
    example: 'https://cdn.example.com/uploads/products/image-123.png',
  })
  @IsString({ message: ErrorMessage.URL_MUST_BE_A_STRING })
  url: string;

  @ApiPropertyOptional({
    description: 'Tên thư mục chứa ảnh, không được là URL',
    example: 'products',
  })
  @IsString({ message: ErrorMessage.FOLDER_NAME_MUST_BE_STRING })
  @Validate(NotUrlValidator)
  @IsOptional()
  folder: string;

  @ApiProperty({
    description: 'Loại ảnh (ví dụ: thumbnail, banner, gallery)',
    enum: ImageType,
    example: ImageType.THUMBNAIL,
  })
  @IsEnum(ImageType, { message: ErrorMessage.IMAGE_TYPE_IS_UNVALID })
  @Validate(NotUrlValidator)
  type: ImageType;
}
