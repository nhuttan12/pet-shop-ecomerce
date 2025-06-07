import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { SendRequestErrorMessage } from 'src/helper/message/send-request-message';

export class SendRequestChangingPostDto {
  @ApiProperty({ description: 'ID bài viết cần gửi request', example: 123 })
  @IsNumber({}, { message: SendRequestErrorMessage.POST_ID_MUST_BE_NUMBER })
  @IsNotEmpty({ message: SendRequestErrorMessage.POST_ID_REQUIRED })
  postId: number;

  @ApiProperty({
    description: 'Lý do đề xuất thay đổi',
    example: 'Nội dung không phù hợp với quy định',
  })
  @IsString({ message: SendRequestErrorMessage.REASON_MUST_BE_STRING })
  @IsNotEmpty({ message: SendRequestErrorMessage.REASON_REQUIRED })
  reason: string;

  @ApiPropertyOptional({
    description: 'Nội dung mới đề xuất (có thể để trống)',
    example: 'Đề xuất chỉnh lại đoạn mở đầu cho phù hợp',
  })
  @IsString({
    message: SendRequestErrorMessage.CONTENT_SUGGESTED_MUST_BE_STRING,
  })
  @IsOptional()
  contentSuggested?: string;
}
