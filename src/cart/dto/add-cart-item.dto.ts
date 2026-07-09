import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class AddCartItemDto {
  @ApiProperty({ description: 'UUID của sản phẩm', example: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  product_id: string;

  @ApiProperty({ description: 'Số lượng', example: 1 })
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiPropertyOptional({ example: { size: 'M', sugar: '70%', ice: '50%' } })
  @IsOptional()
  @IsObject()
  options?: Record<string, string>;
}
