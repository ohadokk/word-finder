"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const article_entity_1 = require("./entities/article.entity");
const user_entity_1 = require("./entities/user.entity");
const comment_entity_1 = require("./entities/comment.entity");
const article_service_1 = require("./services/article.service");
const user_service_1 = require("./services/user.service");
const comment_service_1 = require("./services/comment.service");
const article_controller_1 = require("./controllers/article.controller");
const user_controller_1 = require("./controllers/user.controller");
const comment_controller_1 = require("./controllers/comment.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (config) => ({
                    type: "postgres",
                    host: config.getOrThrow("POSTGRES_HOST"),
                    port: config.getOrThrow("POSTGRES_PORT"),
                    username: config.getOrThrow("POSTGRES_USER"),
                    password: config.getOrThrow("POSTGRES_PASSWORD"),
                    database: config.getOrThrow("POSTGRES_DB"),
                    autoLoadEntities: true,
                    synchronize: true,
                }),
                inject: [config_1.ConfigService],
            }),
            typeorm_1.TypeOrmModule.forFeature([article_entity_1.Article, user_entity_1.User, comment_entity_1.Comment]),
        ],
        controllers: [article_controller_1.ArticleController, user_controller_1.UserController, comment_controller_1.CommentController],
        providers: [article_service_1.ArticleService, user_service_1.UserService, comment_service_1.CommentService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map