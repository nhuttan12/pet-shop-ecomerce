import { ErrorMessage } from '@messages/error.messages';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProductStatus } from '@product/enums/product-status.enum';
import { ProductErrorMessage } from '@product/messages/product.error-messages';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsIn,
  IsEnum,
  IsInt,
} from 'class-validator';

export class ProductFilterParams {
  @ApiPropertyOptional({
    description: 'Tên sản phẩm cần tìm kiếm (có thể chứa từ khóa)',
    example: 'nước hoa',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Giá tối thiểu (VND)',
    example: 50000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Giá tối đa (VND)',
    example: 200000,
  })
  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Tên thương hiệu',
    example: 'Diamond',
  })
  @IsOptional()
  @IsString()
  brandName?: string;

  @ApiPropertyOptional({
    description: 'Số lượng tồn kho tối thiểu',
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  stocking?: number;

  @ApiPropertyOptional({
    description: 'Phần trăm giảm giá tối thiểu',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  discount?: number;

  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
    description: 'Thứ tự sắp xếp (mặc định: desc)',
    example: 'asc',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({
    description: 'Danh mục sản phẩm',
    example: 'Dầu Thơm',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    enum: ProductStatus,
    description: 'Trạng thái sản phẩm',
    example: ProductStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(ProductStatus, {
    message: ProductErrorMessage.PRODUCT_STATUS_IS_UNVALID,
  })
  status: ProductStatus;

  @ApiPropertyOptional({
    default: 1,
    description: 'Trang số (bắt đầu từ 1)',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: ErrorMessage.PAGE_MUST_BE_INTETER })
  @Min(1, { message: ErrorMessage.PAGE_SHOULD_NOT_A_NEGATIVE_NUMBER })
  page: number;

  @ApiPropertyOptional({
    default: 10,
    description: 'Số lượng sản phẩm mỗi trang',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: ErrorMessage.LIMIT_MUST_BE_INTETER })
  @Min(10, { message: ErrorMessage.LIMIT_HAVE_AT_LEAST_10 })
  limit: number;
}
