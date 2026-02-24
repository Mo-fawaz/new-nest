import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePostImageDto {

  @IsOptional()
  id?: number;

  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  caption?: string;

}

export class UpdatePostDto {

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdatePostImageDto)
  images: UpdatePostImageDto[];

}
