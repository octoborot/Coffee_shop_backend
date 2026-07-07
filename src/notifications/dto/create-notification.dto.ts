import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateNotificationDto {
  @ApiPropertyOptional({ description: 'Null nếu là thông báo toàn hệ thống' })
  @IsOptional()
  @IsUUID()
  customer_id?: string;

  @ApiProperty({ example: 'Ưu đãi mới dành cho bạn' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Nhập mã HOTDEAL để nhận ưu đãi hôm nay.' })
  @IsString()
  description: string;

  @ApiProperty({ enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiPropertyOptional({ example: 'https://example.com/promo.jpg' })
  @IsOptional()
  @IsString()
  image?: string;
}
