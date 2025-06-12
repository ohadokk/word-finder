import { IsUUID, IsString } from 'class-validator';

export class CommentResponseDto {
  @IsUUID()
  id!: string;

  @IsString()
  content!: string;

  @IsUUID()
  articleId!: string;
}