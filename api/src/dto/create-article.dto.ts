import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  body!: string;

  @IsUUID()
  authorId!: string;
}