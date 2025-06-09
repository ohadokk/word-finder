import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comment } from "../entities/comment.entity";
import { Article } from "../entities/article.entity";
import { User } from "../entities/user.entity";
import { CreateCommentDto } from "../dto/create-comment.dto";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(Article) private articleRepo: Repository<Article>,
    @InjectRepository(User) private userRepo: Repository<User>
  ) {}

  async create(dto: CreateCommentDto): Promise<Comment> {
    const user = await this.userRepo.findOneByOrFail({ id: dto.userId });
    const article = await this.articleRepo.findOneByOrFail({
      id: dto.articleId,
    });
    const comment = this.commentRepo.create({
      content: dto.content,
      user,
      article,
    });
    return this.commentRepo.save(comment);
  }

  findOne(id: string) {
    return this.commentRepo.findOneBy({ id });
  }
}
