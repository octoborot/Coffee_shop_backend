import { ApiPropertyOptional } from '@nestjs/swagger';
import { DiscountType, ProductCategory } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { VoucherStatus } from '../voucher-status.enum';

export class GetVouchersQueryDto {
  @ApiPropertyOptional({ enum: DiscountType })
  @IsOptional()
  @IsEnum(DiscountType)
  discount_type?: DiscountType;

  @ApiPropertyOptional({ enum: ProductCategory })
  @IsOptional()
  @IsEnum(ProductCategory)
  category?: ProductCategory;

  @ApiPropertyOptional({ enum: VoucherStatus })
  @IsOptional()
  @IsEnum(VoucherStatus)
  status?: VoucherStatus;

  @ApiPropertyOptional({
    description: 'Giữ lại để tương thích với bộ lọc bật/tắt',
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({
    example: 'BLOOM',
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  starts_from?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  starts_to?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  ends_from?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  ends_to?: string;

  @ApiPropertyOptional({
    enum: [
      'created_at',
      'updated_at',
      'starts_at',
      'ends_at',
      'used_count',
      'code',
    ],
  })
  @IsOptional()
  @IsIn([
    'created_at',
    'updated_at',
    'starts_at',
    'ends_at',
    'used_count',
    'code',
  ])
  sort_by?: string = 'created_at';

  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sort_order?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({
    default: 1,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({
    default: 10,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(50)
  limit = 10;
}
