import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class DeleteVoucherImageDto {
  @ApiProperty({
    example: 'coffee-shop/vouchers/bloom20',
  })
  @IsString()
  @Matches(/^coffee-shop\/vouchers\/[A-Za-z0-9/_-]+$/, {
    message: 'public_id phải thuộc thư mục coffee-shop/vouchers/.',
  })
  public_id: string;
}
