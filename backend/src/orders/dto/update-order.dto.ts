import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsEnum, MaxLength } from 'class-validator';
import { OrderStatus, Course, CourseType, CourseFormat } from '../entities/order.entity';

export class UpdateOrderDto {
  @ApiPropertyOptional({ description: 'Student first name', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  name?: string;

  @ApiPropertyOptional({ description: 'Student surname', maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  surname?: string;

  @ApiPropertyOptional({ description: 'Student email', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  email?: string;

  @ApiPropertyOptional({ description: 'Student phone', maxLength: 12 })
  @IsOptional()
  @IsString()
  @MaxLength(12)
  phone?: string;

  @ApiPropertyOptional({ description: 'Student age' })
  @IsOptional()
  @IsNumber()
  age?: number;

  @ApiPropertyOptional({ description: 'Course', enum: Course })
  @IsOptional()
  @IsEnum(Course)
  course?: Course;

  @ApiPropertyOptional({ description: 'Course format', enum: CourseFormat })
  @IsOptional()
  @IsEnum(CourseFormat)
  course_format?: CourseFormat;

  @ApiPropertyOptional({ description: 'Course type', enum: CourseType })
  @IsOptional()
  @IsEnum(CourseType)
  course_type?: CourseType;

  @ApiPropertyOptional({ description: 'Total sum' })
  @IsOptional()
  @IsNumber()
  sum?: number;

  @ApiPropertyOptional({ description: 'Already paid amount' })
  @IsOptional()
  @IsNumber()
  alreadyPaid?: number;

  @ApiPropertyOptional({ description: 'UTM parameters', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  utm?: string;

  @ApiPropertyOptional({ description: 'Message', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  msg?: string;

  @ApiPropertyOptional({ description: 'Order status', enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({ description: 'Group ID' })
  @IsOptional()
  @IsNumber()
  groupId?: number;
}