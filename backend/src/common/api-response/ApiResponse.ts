import { ApiProperty } from '@nestjs/swagger';

export class ApiResponse<T> {
  @ApiProperty({ description: 'Mã trạng thái HTTP', example: 200 })
  statusCode: number;

  @ApiProperty({
    description: 'Thông điệp phản hồi',
    example: 'Lấy thông tin người dùng thành công',
  })
  message: string;

  @ApiProperty({ description: 'Dữ liệu trả về', type: () => Object })
  data?: T;
}
