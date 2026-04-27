import { IsString, IsOptional, IsNumber, IsUrl } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  title: string;

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
