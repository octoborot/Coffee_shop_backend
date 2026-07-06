import { Type } from 'class-transformer';
import {
  IsString, IsEnum, IsOptional, IsArray,
  ValidateNested, IsInt, IsPositive, IsObject, IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderType } from '@prisma/client';

export class OrderItemDto {
  @ApiProperty({ description: 'UUID của sản phẩm' })
  @IsString()
  @IsNotEmpty()
  product_id: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiPropertyOptional({ example: { size: 'M', sweetness: '50%', ice: '100%' } })
  @IsOptional()
  @IsObject()
  options?: Record<string, string>;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ enum: OrderType })
  @IsEnum(OrderType)
  type: OrderType;

  @ApiPropertyOptional({ description: 'Địa chỉ giao hàng (bắt buộc nếu type = Delivery)' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ enum: ['cash', 'zalopay'], default: 'cash' })
  @IsEnum(['cash', 'zalopay'])
  payment_method: 'cash' | 'zalopay';

  @ApiPropertyOptional({ description: 'Tên khách hàng (dành cho đặt hàng không đăng nhập)' })
  @IsOptional()
  @IsString()
  customer_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customer_phone?: string;
}
