import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class UserProfileResponseDTO {
  @AutoMap()
  @ApiProperty({ description: 'ID của người dùng', example: 1 })
  id: number;

  @AutoMap()
  @ApiProperty({ description: 'Tên của người dùng', example: 'Nguyễn Văn A' })
  name: string;

  @AutoMap()
  @ApiProperty({
    description: 'Địa chỉ email của người dùng',
    example: 'nguyenvana@example.com',
  })
  email: string;

  @AutoMap()
  @ApiProperty({
    description: 'URL ảnh đại diện của người dùng',
    example: 'https://example.com/avatar.jpg',
  })
  avatar: string;

  @AutoMap()
  @ApiProperty({
    description: 'Số điện thoại của người dùng',
    example: '0123456789',
  })
  phone: string;

  @AutoMap()
  @ApiProperty({ description: 'Giới tính của người dùng', example: 'Nam' })
  gender: string;

  @AutoMap()
  @ApiProperty({
    description: 'Ngày sinh của người dùng',
    example: '1990-01-01T00:00:00.000Z',
    type: String,
  })
  birthDate: Date;
}
