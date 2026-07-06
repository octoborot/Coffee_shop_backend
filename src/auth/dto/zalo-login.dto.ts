import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ZaloLoginDto {
  @ApiProperty({ description: 'Authorization code lấy từ Zalo Mini App SDK' })
  @IsString()
  @IsNotEmpty()
  code: string;
}
