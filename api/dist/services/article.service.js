"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const redis_service_1 = require("../redis.service");
const article_repository_1 = require("../repositories/article.repository");
let ArticleService = class ArticleService {
    constructor(articleRepo, userRepo, publisher) {
        this.articleRepo = articleRepo;
        this.userRepo = userRepo;
        this.publisher = publisher;
    }
    async create(dto) {
        const author = await this.userRepo.findOneByOrFail({ id: dto.authorId });
        const saved = await this.articleRepo.save(author, dto);
        this.publisher.publishMessage("article_created", {
            id: saved.id,
            body: saved.body,
        });
        return this.toArticleResponseDto(saved);
    }
    async findOne(id) {
        return await this.articleRepo.findOneWithRelationsDto(id);
    }
    async findAll() {
        return await this.articleRepo.findAllWithRelationsDto();
    }
    async findWords(words) {
        const articles = await this.articleRepo.getArticlesByWords(words);
        const result = {};
        for (const word of words.map((w) => w.toLowerCase())) {
            for (const article of articles) {
                const offsets = article.wordOffsets[word];
                if (offsets && offsets.length > 0) {
                    if (!result[word])
                        result[word] = [];
                    result[word].push({ article_id: article.id, offsets });
                }
            }
        }
        return result;
    }
    async findMostCommon(word) {
        var _a;
        const wordLower = word.toLowerCase().replace(/[':]/g, "");
        const articles = await this.articleRepo.getArticlesByWord(word);
        let maxCount = 0;
        let result = null;
        for (const article of articles) {
            const count = ((_a = article.wordFrequencies) === null || _a === void 0 ? void 0 : _a[wordLower]) || 0;
            if (count > maxCount) {
                maxCount = count;
                result = { article_id: article.id, count };
            }
        }
        return result || { article_id: null, count: 0 };
    }
    toArticleResponseDto(article) {
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
};
exports.ArticleService = ArticleService;
exports.ArticleService = ArticleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)()),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, common_1.Inject)()),
    __metadata("design:paramtypes", [article_repository_1.ArticleRepository,
        typeorm_2.Repository,
        redis_service_1.RedisService])
], ArticleService);
//# sourceMappingURL=article.service.js.map