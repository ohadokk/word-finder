import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Article } from "../entities/article.entity";
import { CreateArticleDto } from "../dto/create-article.dto";
import { User } from "../entities/user.entity";

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private articleRepo: Repository<Article>,
    @InjectRepository(User) private userRepo: Repository<User>
  ) {}

  private buildOffsetMap(body: string): Record<string, number[]> {
    const map: Record<string, number[]> = {};
    const lower = body.toLowerCase();
    const wordRegex = /\b\w+\b/g;
    let match;
    while ((match = wordRegex.exec(lower)) !== null) {
      const word = match[0];
      const offset = match.index;
      if (!map[word]) map[word] = [];
      map[word].push(offset);
    }
    return map;
  }

  async create(dto: CreateArticleDto): Promise<Article> {
    const author = await this.userRepo.findOneByOrFail({ id: dto.authorId });
    const wordOffsets = this.buildOffsetMap(dto.body);
    const article = this.articleRepo.create({ ...dto, author, wordOffsets });
    return this.articleRepo.save(article);
  }

  async findOne(id: string): Promise<Article> {
    return this.articleRepo.findOneByOrFail({ id });
  }

  async findAll(): Promise<Article[]> {
    return this.articleRepo.find();
  }

  async findWords(words: string[]) {
    const articles = await this.articleRepo.find();
    const result: Record<string, { article_id: string; offsets: number[] }[]> =
      {};

    for (const word of words.map((w) => w.toLowerCase())) {
      for (const article of articles) {
        const offsets = article.wordOffsets[word];
        if (offsets && offsets.length > 0) {
          if (!result[word]) result[word] = [];
          result[word].push({ article_id: article.id, offsets });
        }
      }
    }
    return result;
  }
}
