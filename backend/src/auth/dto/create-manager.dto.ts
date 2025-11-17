import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';

export class CreateManagerDto {
  @ApiProperty({ description: 'Manager email', example: 'manager@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Manager first name', example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Manager last name', example: 'Doe' })
  @IsString()
  lastName: string;
}
