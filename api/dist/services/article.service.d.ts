import { Repository } from "typeorm";
import { CreateArticleDto } from "../dto/create-article.dto";
import { User } from "../entities/user.entity";
import { RedisService } from "src/redis.service";
import { ArticleRepository } from "../repositories/article.repository";
import { ArticleResponseDto } from "../dto/article-response.dto";
export declare class ArticleService {
    private articleRepo;
    private userRepo;
    private publisher;
    constructor(articleRepo: ArticleRepository, userRepo: Repository<User>, publisher: RedisService);
    create(dto: CreateArticleDto): Promise<ArticleResponseDto>;
    findOne(id: string): Promise<ArticleResponseDto>;
    findAll(): Promise<ArticleResponseDto[]>;
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
    private toArticleResponseDto;
}
