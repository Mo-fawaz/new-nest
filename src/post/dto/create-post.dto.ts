import { Type } from "class-transformer";
import { IsArray, IsOptional, IsString, ValidateNested } from "class-validator";

class ImageDto {

  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  caption?: string;

}

export class CreatePostDto {
  
    @IsString()
    title: string; 

    
    @IsString()
    content: string;
      
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ImageDto)
    images?: ImageDto[];
}
