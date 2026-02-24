import { IsOptional, IsString, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePostImageDto {

  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  caption?: string;

}

export class UpdatePostImageDto {


    @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  caption?: string;

}

export class DeletePostImageDto {

    @IsNumber()
  id: number;

}

export class UpdatePostDto {

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePostImageDto)
  create?: CreatePostImageDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePostImageDto)
  update?: UpdatePostImageDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeletePostImageDto)
  delete?: DeletePostImageDto[];

}