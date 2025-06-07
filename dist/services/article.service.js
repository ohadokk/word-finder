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
const article_entity_1 = require("../entities/article.entity");
const user_entity_1 = require("../entities/user.entity");
let ArticleService = class ArticleService {
    constructor(articleRepo, userRepo) {
        this.articleRepo = articleRepo;
        this.userRepo = userRepo;
    }
    buildOffsetMap(body) {
        const map = {};
        const lower = body.toLowerCase();
        const wordRegex = /\b\w+\b/g;
        let match;
        while ((match = wordRegex.exec(lower)) !== null) {
            const word = match[0];
            const offset = match.index;
            if (!map[word])
                map[word] = [];
            map[word].push(offset);
        }
        return map;
    }
    async create(dto) {
        const author = await this.userRepo.findOneByOrFail({ id: dto.authorId });
        const wordOffsets = this.buildOffsetMap(dto.body);
        const article = this.articleRepo.create(Object.assign(Object.assign({}, dto), { author, wordOffsets }));
        return this.articleRepo.save(article);
    }
    async findOne(id) {
        return this.articleRepo.findOneByOrFail({ id });
    }
    async findAll() {
        return this.articleRepo.find();
    }
    async findWords(words) {
        const articles = await this.articleRepo.find();
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
};
exports.ArticleService = ArticleService;
exports.ArticleService = ArticleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(article_entity_1.Article)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ArticleService);
//# sourceMappingURL=article.service.js.map