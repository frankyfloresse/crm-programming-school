import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import {
  OrderStatus,
  Course,
  CourseType,
  CourseFormat,
} from '../entities/order.entity';

export class UpdateOrderDto {
  @ApiPropertyOptional({ description: 'Student first name', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  name?: string | null;

  @ApiPropertyOptional({ description: 'Student surname', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  surname?: string | null;

  @ApiPropertyOptional({ description: 'Student email', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  email?: string | null;

  @ApiPropertyOptional({ description: 'Student phone', maxLength: 12 })
  @IsOptional()
  @IsString()
  @MaxLength(12)
  phone?: string | null;

  @ApiPropertyOptional({ description: 'Student age', minimum: 0, maximum: 120 })
  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Age cannot be less than 1' })
  @Max(120, { message: 'Age cannot be more than 120' })
  age?: number | null;

  @ApiPropertyOptional({ description: 'Course', enum: Course })
  @IsOptional()
  @IsEnum(Course)
  course?: Course | null;

  @ApiPropertyOptional({ description: 'Course format', enum: CourseFormat })
  @IsOptional()
  @IsEnum(CourseFormat)
  course_format?: CourseFormat | null;

  @ApiPropertyOptional({ description: 'Course type', enum: CourseType })
  @IsOptional()
  @IsEnum(CourseType)
  course_type?: CourseType | null;

  @ApiPropertyOptional({ description: 'Total sum', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Sum cannot be negative' })
  sum?: number | null;

  @ApiPropertyOptional({ description: 'Already paid amount', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Already paid amount cannot be negative' })
  alreadyPaid?: number | null;

  @ApiPropertyOptional({ description: 'UTM parameters', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  utm?: string | null;

  @ApiPropertyOptional({ description: 'Message', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  msg?: string | null;

  @ApiPropertyOptional({ description: 'Order status', enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus | null;

  @ApiPropertyOptional({ description: 'Group ID' })
  @IsOptional()
  groupId?: number | null;
}
