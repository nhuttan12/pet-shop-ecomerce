import { ApiProperty } from '@nestjs/swagger';

export class VoucherResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  voucherCode: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  discount: number;

  @ApiProperty({ type: Date })
  expireAt: Date;

  @ApiProperty({ type: Date })
  created_at: Date;

  @ApiProperty({ type: Date })
  updated_at: Date;
}
