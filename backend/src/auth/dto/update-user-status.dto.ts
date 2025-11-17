import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateUserStatusDto {
  @ApiProperty({ description: 'Ban status', example: true, required: false })
  @IsOptional()
  @IsEnum([true, false])
  is_banned?: boolean;
}