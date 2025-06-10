export class CommentResponseDto {
  id!: string;
  content!: string;
  createdAt!: Date;
}

export class AuthorResponseDto {
  id!: string;
  username!: string;
}

export class ArticleResponseDto {
  id!: string;
  title!: string;
  body!: string;
  createdAt!: Date;
  author!: AuthorResponseDto;
  comments!: CommentResponseDto[];
}