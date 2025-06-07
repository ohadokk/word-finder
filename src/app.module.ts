import { Module } from "@nestjs/common";
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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "infra_assignment",
      autoLoadEntities: true,
      synchronize: true, // Turn off in production!
    }),
    TypeOrmModule.forFeature([Article, User, Comment]),
  ],
  controllers: [ArticleController, UserController, CommentController],
  providers: [ArticleService, UserService, CommentService],
})
export class AppModule {}
