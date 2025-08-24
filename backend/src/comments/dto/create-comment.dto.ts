import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment message',
    example: 'This order needs additional review',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: 'Order ID to comment on',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  orderId: number;
}