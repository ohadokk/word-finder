import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Comment } from "./entities/comment.entity";
import { UserService } from "./services/user.service";
import { CommentService } from "./services/comment.service";
import { UserController } from "./controllers/user.controller";
import { CommentController } from "./controllers/comment.controller";
import { RedisService } from "./redis.service";
import { ArticleRepository } from "./repositories/article.repository";
import { Article } from "./entities/article.entity";
import { ArticleService } from "./services/article.service";
import { ArticleController } from "./controllers/article.controller";
import { DataSource } from "typeorm";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "../.env",
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        host: config.getOrThrow<string>("POSTGRES_HOST"),
        port: config.getOrThrow<number>("POSTGRES_PORT"),
        username: config.getOrThrow<string>("POSTGRES_USER"),
        password: config.getOrThrow<string>("POSTGRES_PASSWORD"),
        database: config.getOrThrow<string>("POSTGRES_DB"),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Comment, Article]),
  ],
  controllers: [UserController, CommentController, ArticleController],
  providers: [
    UserService,
    CommentService,
    ArticleService,
    RedisService,
    ArticleRepository,
  ],
})
export class AppModule {}
