import { Type } from 'class-transformer';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  IsInt,
  IsPositive,
  IsObject,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderType, PaymentMethod } from '@prisma/client';

export class OrderItemDto {
  @ApiProperty({ description: 'UUID của sản phẩm' })
  @IsUUID()
  @IsNotEmpty()
  product_id: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiPropertyOptional({
    example: { size: 'M', sweetness: '50%', ice: '100%' },
  })
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

  @ApiPropertyOptional({
    description:
      'Địa chỉ giao hàng (bắt buộc nếu type = Delivery và không có customer_address_id)',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'ID sổ địa chỉ (nếu có)' })
  @IsOptional()
  @Transform(({ value }) => (value === '' || value === 'string' ? undefined : value))
  @IsUUID()
  customer_address_id?: string;

  @ApiPropertyOptional({
    description: 'ID cửa hàng nhận món (nếu type = Pickup)',
  })
  @IsOptional()
  @Transform(({ value }) => (value === '' || value === 'string' ? undefined : value))
  @IsUUID()
  store_location_id?: string;

  @ApiPropertyOptional({ description: 'ID của voucher áp dụng' })
  @IsOptional()
  @Transform(({ value }) => (value === '' || value === 'string' ? undefined : value))
  @IsUUID()
  voucher_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ enum: PaymentMethod, default: PaymentMethod.CASH })
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  @ApiPropertyOptional({
    description: 'Tên khách hàng (dành cho đặt hàng không đăng nhập)',
  })
  @IsOptional()
  @IsString()
  customer_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customer_phone?: string;
}
