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
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const comment_entity_1 = require("../entities/comment.entity");
const article_entity_1 = require("../entities/article.entity");
const user_entity_1 = require("../entities/user.entity");
let CommentService = class CommentService {
    constructor(commentRepo, articleRepo, userRepo) {
        this.commentRepo = commentRepo;
        this.articleRepo = articleRepo;
        this.userRepo = userRepo;
    }
    async create(dto) {
        const user = await this.userRepo.findOneByOrFail({ id: dto.userId });
        const article = await this.articleRepo.findOneByOrFail({
            id: dto.articleId,
        });
        const comment = this.commentRepo.create({
            content: dto.content,
            user,
            article,
        });
        return this.commentRepo.save(comment);
    }
    findOne(id) {
        return this.commentRepo.findOneBy({ id });
    }
};
exports.CommentService = CommentService;
exports.CommentService = CommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(1, (0, typeorm_1.InjectRepository)(article_entity_1.Article)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CommentService);
//# sourceMappingURL=comment.service.js.map