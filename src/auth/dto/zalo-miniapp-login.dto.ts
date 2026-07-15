import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ZaloMiniAppLoginDto {
  @ApiProperty({
    description: 'Access Token lấy từ Zalo Mini App SDK (getAccessToken)',
    example: 'OauthAccessToken_xxxx',
  })
  @IsNotEmpty()
  @IsString()
  access_token: string;

  @ApiPropertyOptional({ description: 'ID người dùng lấy từ Mini App SDK để dự phòng' })
  @IsOptional()
  @IsString()
  zalo_id?: string;

  @ApiPropertyOptional({ description: 'Tên người dùng lấy từ Mini App SDK để dự phòng' })
  @IsOptional()
  @IsString()
  name?: string;
}
