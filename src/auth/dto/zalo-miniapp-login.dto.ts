import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ZaloMiniAppLoginDto {
  @ApiProperty({
    description: 'Access Token lấy từ Zalo Mini App SDK (getAccessToken)',
    example: 'OauthAccessToken_xxxx',
  })
  @IsNotEmpty()
  @IsString()
  access_token: string;
}
