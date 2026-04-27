import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateCourseDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  level?: string;

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsNumber()
  @IsOptional()
  order_index?: number;

  @IsString()
  @IsOptional()
  slug?: string;
}
