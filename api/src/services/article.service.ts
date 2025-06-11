import { Injectable, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Article } from "../entities/article.entity";
import { CreateArticleDto } from "../dto/create-article.dto";
import { User } from "../entities/user.entity";
import { RedisService } from "src/redis.service";
import { ArticleRepository } from "../repositories/article.repository";
import { ArticleResponseDto } from "../dto/article-response.dto";

@Injectable()
export class ArticleService {
  constructor(
    @Inject() private articleRepo: ArticleRepository,
    @InjectRepository(User) private userRepo: Repository<User>,
    @Inject() private publisher: RedisService
  ) {}

  public async create(dto: CreateArticleDto): Promise<ArticleResponseDto> {
    const author = await this.userRepo.findOneByOrFail({ id: dto.authorId });

    const saved = await this.articleRepo.save(author, dto);

    this.publisher.publishMessage("article_created", {
      id: saved.id,
      body: saved.body,
    });

    return this.toArticleResponseDto(saved);
  }

  public async findOne(id: string): Promise<ArticleResponseDto> {
    return await this.articleRepo.findOneWithRelationsDto(id);
  }

  public async findAll(): Promise<ArticleResponseDto[]> {
    return await this.articleRepo.findAllWithRelationsDto();
  }

  public async findWords(words: string[]) {
    const articles = await this.articleRepo.getArticlesByWords(words);

    const result: Record<string, { article_id: string; offsets: number[] }[]> =
      {};

    for (const word of words.map((w) => w.toLowerCase())) {
      for (const article of articles) {
        const offsets = article.wordOffsets? article.wordOffsets[word] : [];
        if (offsets && offsets.length > 0) {
          if (!result[word]) result[word] = [];
          result[word].push({ article_id: article.id, offsets });
        }
      }
    }
    return result;
  }

  public async findMostCommon(word: string) {
    const wordLower = word.toLowerCase().replace(/[':]/g, "");

    const articles = await this.articleRepo.getArticlesByWord(word);

    let maxCount = 0;
    let result: { article_id: string; count: number } | null = null;

    for (const article of articles) {
      const count = article.wordFrequencies?.[wordLower] || 0;
      if (count > maxCount) {
        maxCount = count;
        result = { article_id: article.id, count };
      }
    }

    return result || { article_id: null, count: 0 };
  }

  private toArticleResponseDto(article: Article): ArticleResponseDto {
    return {
      id: article.id,
      title: article.title,
      body: article.body,
      createdAt: article.createdAt,
      author: {
        id: article.author.id,
        username: article.author.name,
      },
      comments: article.comments
        ? article.comments.map((c) => ({
            id: c.id,
            content: c.content,
            createdAt: c.createdAt,
          }))
        : [],
    };
  }
}
