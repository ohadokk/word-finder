import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Article } from "../entities/article.entity";
import { ArticleResponseDto } from "../dto/article-response.dto";
import { User } from "src/entities/user.entity";
import { CreateArticleDto } from "../dto/create-article.dto";

@Injectable()
export class ArticleRepository {
  constructor(
    @InjectRepository(Article)
    private readonly repo: Repository<Article>
  ) {}

  private getArticleSelectFields() {
    return [
      "article.id AS id",
      "article.title AS title",
      "article.body AS body",
      'article."createdAt" AS "createdAt"',
      `jsonb_build_object(
      'id', author.id,
      'username', author.name
    ) AS author`,
      `COALESCE(
      json_agg(
        DISTINCT jsonb_build_object(
          'id', comment.id,
          'content', comment.content,
          'createdAt', comment."createdAt"
        )
      ) FILTER (WHERE comment.id IS NOT NULL), '[]'
    ) AS comments`,
    ];
  }
  public async findOneWithRelationsDto(
    id: string
  ): Promise<ArticleResponseDto> {
    const raw = await this.repo
      .createQueryBuilder("article")
      .leftJoin("article.author", "author")
      .leftJoin("article.comments", "comment")
      .select(this.getArticleSelectFields())
      .where("article.id = :id", { id })
      .groupBy("article.id, author.id, author.name")
      .getRawOne();

    return raw as ArticleResponseDto;
  }

  public async findAllWithRelationsDto(): Promise<ArticleResponseDto[]> {
    const raws = await this.repo
      .createQueryBuilder("article")
      .leftJoin("article.author", "author")
      .leftJoin("article.comments", "comment")
      .select(this.getArticleSelectFields())
      .groupBy("article.id, author.id, author.name")
      .getRawMany();

    return raws as ArticleResponseDto[];
  }

  public getArticlesByWord(word: string) {
    return this.repo
      .createQueryBuilder("article")
      .where(`article.body_tsvector @@ to_tsquery('english', :query_word)`, {
        query_word: word,
      })
      .andWhere("article.wordOffsets IS NOT NULL")
      .getMany();
  }

  public getArticlesByWords(words: string[]) {
    const tsquery = words
      .map((w) => w.trim().toLowerCase().replace(/[':]/g, ""))
      .join(" | "); // OR search format

    return this.repo
      .createQueryBuilder("article")
      .where(`article.body_tsvector @@ to_tsquery('english', :tsquery)`, {
        tsquery,
      })
      .andWhere("article.wordOffsets IS NOT NULL")
      .getMany();
  }

  public async save(author: User, dto: CreateArticleDto): Promise<Article> {
    const article = this.repo.create({
      ...dto,
      author,
    });

    const saved = await this.repo.save(article);

    return saved;
  }
}
