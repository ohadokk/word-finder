import { IsString, IsDate, IsArray, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CommentResponseDto {
  @IsUUID()
  id!: string;

  @IsString()
  content!: string;

  @IsDate()
  createdAt!: Date;
}

export class AuthorResponseDto {
  @IsUUID()
  id!: string;

  @IsString()
  username!: string;
}

export class ArticleResponseDto {
  @IsUUID()
  id!: string;

  @IsString()
  title!: string;

  @IsString()
  body!: string;

  @IsDate()
  createdAt!: Date;

  @ValidateNested()
  @Type(() => AuthorResponseDto)
  author!: AuthorResponseDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommentResponseDto)
  comments!: CommentResponseDto[];
}