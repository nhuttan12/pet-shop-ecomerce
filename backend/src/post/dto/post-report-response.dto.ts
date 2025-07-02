import { ApiProperty } from '@nestjs/swagger';
import { PostReportStatus } from '@post';
import { Expose } from 'class-transformer';

export class PostReportResponseDto {
  @ApiProperty({
    description: 'Mã định danh duy nhất của báo cáo bài viết',
    example: 1,
    type: Number,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Tiêu đề của bài viết bị báo cáo',
    example: 'Bài viết mẫu',
    type: String,
  })
  @Expose()
  postTitle: string;

  @ApiProperty({
    description: 'Tên người dùng của tác giả bài viết',
    example: 'user123',
    type: String,
  })
  @Expose()
  userName: string;

  @ApiProperty({
    description: 'Trạng thái của báo cáo',
    example: 'PENDING',
    type: String,
  })
  @Expose()
  status: PostReportStatus | string;

  @ApiProperty({
    description: 'Mô tả chi tiết của báo cáo',
    example: 'Phát hiện nội dung không phù hợp',
    type: String,
  })
  @Expose()
  description: string;

  @ApiProperty({
    description: 'Ngày và giờ báo cáo được tạo',
    example: '2025-06-10T09:57:00.000Z',
    type: String,
  })
  @Expose()
  createdAt: Date | string;
}
