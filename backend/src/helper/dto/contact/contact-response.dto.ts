import { ApiProperty } from '@nestjs/swagger';
import { ContactStatus } from 'src/helper/enum/status/contact-status.enum copy';

export class ContactResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Nguyen Van A' })
  name: string;

  @ApiProperty({ example: 'example@gmail.com' })
  email: string;

  @ApiProperty({ example: 'Hỗ trợ đăng ký tài khoản' })
  title: string;

  @ApiProperty({ example: 'Tôi cần hỗ trợ về vấn đề đăng ký tài khoản...' })
  message: string;

  @ApiProperty({ enum: ContactStatus, example: ContactStatus.RECEIVED })
  status: ContactStatus;

  @ApiProperty({ example: '2025-06-05T04:21:21.000Z' })
  created_at: Date;
}
