import { Repository } from "typeorm";
import { Article } from "../entities/article.entity";
import { CreateArticleDto } from "../dto/create-article.dto";
import { User } from "../entities/user.entity";
export declare class ArticleService {
    private articleRepo;
    private userRepo;
    constructor(articleRepo: Repository<Article>, userRepo: Repository<User>);
    private buildOffsetMap;
    create(dto: CreateArticleDto): Promise<Article>;
    findOne(id: string): Promise<Article>;
    findAll(): Promise<Article[]>;
    findWords(words: string[]): Promise<Record<string, {
        article_id: string;
        offsets: number[];
    }[]>>;
}
