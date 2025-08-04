import { ApiProperty } from '@nestjs/swagger';
import { PostReportStatus } from '@post/enums/post-report-status.enum';
import { Expose } from 'class-transformer';
import { AutoMap } from '@automapper/classes';

export class PostReportResponseDto {
  @ApiProperty({
    description: 'Mã định danh duy nhất của báo cáo bài viết',
    example: 1,
    type: Number,
  })
  @Expose()
  @AutoMap()
  id: number;

  @ApiProperty({
    description: 'Tiêu đề của bài viết bị báo cáo',
    example: 'Bài viết mẫu',
    type: String,
  })
  @Expose()
  @AutoMap()
  postTitle: string;

  @ApiProperty({
    description: 'Tên người dùng của tác giả bài viết',
    example: 'user123',
    type: String,
  })
  @Expose()
  @AutoMap()
  userName: string;

  @ApiProperty({
    description: 'Trạng thái của báo cáo',
    example: 'PENDING',
    type: String,
  })
  @Expose()
  @AutoMap()
  status: PostReportStatus | string;

  @ApiProperty({
    description: 'Mô tả chi tiết của báo cáo',
    example: 'Phát hiện nội dung không phù hợp',
    type: String,
  })
  @Expose()
  @AutoMap()
  description: string;

  @ApiProperty({
    description: 'Ngày và giờ báo cáo được tạo',
    example: '2025-06-10T09:57:00.000Z',
    type: String,
  })
  @Expose()
  @AutoMap()
  createdAt: Date | string;
}
