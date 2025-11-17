import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ActivateAccountDto {
  @ApiProperty({ description: 'Activation token' })
  @IsString()
  token: string;

  @ApiProperty({ description: 'New password', example: 'Password123!' })
  @IsString()
  @MinLength(6)
  password: string;
}