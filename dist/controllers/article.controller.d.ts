import { ArticleService } from "../services/article.service";
import { CreateArticleDto } from "../dto/create-article.dto";
export declare class ArticleController {
    private readonly articleService;
    constructor(articleService: ArticleService);
    create(dto: CreateArticleDto): Promise<import("../entities/article.entity").Article>;
    findOne(id: string): Promise<import("../entities/article.entity").Article>;
    findWords(words: string[]): Promise<Record<string, {
        article_id: string;
        offsets: number[];
    }[]>>;
    findMostCommon(word: string): Promise<{
        article_id: string | null;
        count: number;
    }>;
}
