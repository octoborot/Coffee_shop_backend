import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductCategory, ProductStatus } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Caramel Macchiato' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Caramel Macchiato Đá' })
  @IsOptional()
  @IsString()
  subname?: string;

  @ApiProperty({ enum: ProductCategory })
  @IsEnum(ProductCategory)
  category: ProductCategory;

  @ApiProperty({ example: 1.8 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 45000 })
  @IsInt()
  @Min(0)
  price_vnd: number;

  @ApiPropertyOptional({ example: 4.8 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({ example: 'https://example.com/caramel.jpg' })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  image?: string;

  @ApiPropertyOptional({
    example: 'coffee-shop/products/caramel-macchiato',
  })
  @IsOptional()
  @IsString()
  @Matches(/^coffee-shop\/products\/[A-Za-z0-9/_-]+$/, {
    message: 'image_public_id phải thuộc thư mục coffee-shop/products/.',
  })
  image_public_id?: string;

  @ApiPropertyOptional({
    enum: ProductStatus,
    default: ProductStatus.Available,
  })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({ example: 'Size M • Ít đường • Nhiều đá' })
  @IsOptional()
  @IsString()
  details?: string;

  @ApiPropertyOptional({
    example: 'Sự hòa quyện giữa espresso, sữa và caramel.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: ['Best Seller', 'Bán Chạy'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
