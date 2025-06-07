import { Controller, Post, Get, Param, Body, Query } from "@nestjs/common";
import { ArticleService } from "../services/article.service";
import { CreateArticleDto } from "../dto/create-article.dto";

@Controller("articles")
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  create(@Body() dto: CreateArticleDto) {
    return this.articleService.create(dto);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.articleService.findOne(id);
  }

  @Post("search")
  findWords(@Body("words") words: string[]) {
    return this.articleService.findWords(words);
  }

  @Get("search/most-common")
  async findMostCommon(@Query("word") word: string) {
    const articles = await this.articleService.findAll();
    const wordLower = word.toLowerCase();
    let max = 0,
      articleId = null;
    for (const article of articles) {
      const count = article.wordOffsets[wordLower]?.length || 0;
      if (count > max) {
        max = count;
        articleId = article.id;
      }
    }
    return { article_id: articleId, count: max };
  }
}
