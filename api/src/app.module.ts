import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Article } from "./entities/article.entity";
import { User } from "./entities/user.entity";
import { Comment } from "./entities/comment.entity";
import { ArticleService } from "./services/article.service";
import { UserService } from "./services/user.service";
import { CommentService } from "./services/comment.service";
import { ArticleController } from "./controllers/article.controller";
import { UserController } from "./controllers/user.controller";
import { CommentController } from "./controllers/comment.controller";
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisService } from "./redis.service";

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

    TypeOrmModule.forFeature([Article, User, Comment]),
  ],
  controllers: [ArticleController, UserController, CommentController],

  // ✅ These come AFTER imports, so everything is resolved correctly
  providers: [ArticleService, UserService, CommentService, RedisService],
})
export class AppModule {}
