import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RejectOrderDto {
  @ApiProperty({
    example: 'San pham het hang',
    description: 'Ly do admin tu choi don hang',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  reason: string;
}
