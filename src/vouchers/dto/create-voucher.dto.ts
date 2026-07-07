import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DiscountType, ProductCategory } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateVoucherDto {
  @ApiProperty({ example: 'HOTDEAL' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'Mua 1 tặng 1' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Áp dụng cho Coffee và Tea.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/voucher.jpg' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ enum: DiscountType })
  @IsEnum(DiscountType)
  discount_type: DiscountType;

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  discount_value: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  min_order_vnd?: number;

  @ApiPropertyOptional({ example: 50000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  max_discount_vnd?: number;

  @ApiPropertyOptional({ enum: ProductCategory, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(ProductCategory, { each: true })
  applicable_categories?: ProductCategory[];

  @ApiPropertyOptional({ example: '2026-07-01T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  starts_at?: string;

  @ApiPropertyOptional({ example: '2026-07-31T23:59:59.000Z' })
  @IsOptional()
  @IsDateString()
  ends_at?: string;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsInt()
  @Min(1)
  usage_limit?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
