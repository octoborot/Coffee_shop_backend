import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ZaloPhoneDto {
  @ApiProperty({
    description: 'Access Token lấy từ Zalo Mini App SDK',
  })
  @IsNotEmpty()
  @IsString()
  access_token: string;

  @ApiProperty({
    description: 'Token lấy từ hàm getPhoneNumber của Zalo Mini App',
  })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({
    description: 'Mã ID của khách hàng để cập nhật số điện thoại',
  })
  @IsNotEmpty()
  @IsString()
  customerId: string;
}
