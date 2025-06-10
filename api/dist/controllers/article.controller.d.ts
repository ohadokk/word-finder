import { ArticleService } from "../services/article.service";
import { CreateArticleDto } from "../dto/create-article.dto";
export declare class ArticleController {
    private readonly articleService;
    constructor(articleService: ArticleService);
    create(dto: CreateArticleDto): Promise<import("../dto/article-response.dto").ArticleResponseDto>;
    findOne(id: string): Promise<import("../dto/article-response.dto").ArticleResponseDto>;
    findWords(words: string[]): Promise<Record<string, {
        article_id: string;
        offsets: number[];
    }[]>>;
    findMostCommon(word: string): Promise<{
        article_id: string;
        count: number;
    } | {
        article_id: null;
        count: number;
    }>;
}
