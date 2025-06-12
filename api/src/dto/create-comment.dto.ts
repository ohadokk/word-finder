import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsUUID()
  userId!: string;

  @IsUUID()
  articleId!: string;
}