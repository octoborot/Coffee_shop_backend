import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class DeleteProductImageDto {
  @ApiProperty({ example: 'coffee-shop/products/caramel-macchiato' })
  @IsString()
  @Matches(/^coffee-shop\/products\/[A-Za-z0-9/_-]+$/, {
    message: 'public_id phải thuộc thư mục coffee-shop/products/.',
  })
  public_id: string;
}
