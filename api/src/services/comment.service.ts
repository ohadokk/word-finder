import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comment } from "../entities/comment.entity";
import { Article } from "../entities/article.entity";
import { User } from "../entities/user.entity";
import { CreateCommentDto } from "../dto/create-comment.dto";
import { CommentResponseDto } from "../dto/comment-response.dto";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(Article) private articleRepo: Repository<Article>,
    @InjectRepository(User) private userRepo: Repository<User>
  ) {}

  public async create(dto: CreateCommentDto): Promise<CommentResponseDto> {
    const user = await this.userRepo.findOneByOrFail({ id: dto.userId });
    const article = await this.articleRepo.findOneByOrFail({
      id: dto.articleId,
    });

    const comment = this.commentRepo.create({
      content: dto.content,
      user,
      article,
    });

    const savedComment = await this.commentRepo.save(comment);

    return {
      id: savedComment.id,
      content: savedComment.content,
      articleId: savedComment.article.id,
    };
  }

  public async findOne(id: string): Promise<CommentResponseDto | null> {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ["article"],
    });

    if (!comment) return null;

    return {
      id: comment.id,
      content: comment.content,
      articleId: comment.article.id,
    };
  }

  public async findAllByArticleId(
    articleId: string
  ): Promise<CommentResponseDto[]> {
    const comments = await this.commentRepo.find({
      where: { article: { id: articleId } },
      relations: ["article"],
      order: { createdAt: "ASC" },
    });

    return comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      articleId: comment.article.id,
    }));
  }
}
