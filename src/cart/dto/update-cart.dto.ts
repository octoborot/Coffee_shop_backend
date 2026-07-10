import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsObject, IsOptional, IsPositive } from 'class-validator';

export class UpdateCartDto {
  @ApiPropertyOptional({ description: 'Số lượng', example: 1 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  quantity?: number;

  @ApiPropertyOptional({
    example: { size: 'L', sweetness: '50%', ice: '50%' },
  })
  @IsOptional()
  @IsObject()
  options?: Record<string, string>;
}
