import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../entities/article.entity';
import { CreateArticleDto } from '../dto/create-article.dto';
import { User } from '../entities/user.entity';
import { RedisService } from 'src/redis.service';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private articleRepo: Repository<Article>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @Inject() private publisher: RedisService,
  ) {}

  async create(dto: CreateArticleDto): Promise<Article> {
    const author = await this.userRepo.findOneByOrFail({ id: dto.authorId });

    const article = this.articleRepo.create({
      ...dto,
      author,
    });

    const saved = await this.articleRepo.save(article);

    this.publisher.publishMessage('article_created', {
      id: saved.id,
      body: saved.body,
    });

    return saved;
  }

  async findOne(id: string): Promise<Article> {
    return this.articleRepo.findOneByOrFail({ id });
  }

  async findAll(): Promise<Article[]> {
    return this.articleRepo.find();
  }

  async findWords(words: string[]) {
    const articles = await this.articleRepo.find();
    const result: Record<string, { article_id: string; offsets: number[] }[]> = {};

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

  async findMostCommon(word: string) {
    const wordLower = word.toLowerCase();
    const articles = await this.articleRepo.find();

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
}



