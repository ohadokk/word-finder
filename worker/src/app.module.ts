import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Article } from "./entities/article.entity";
import { ArticleProcessorService } from "./article-processor.service";
import { ArticleProcessorController } from "./article-processor.controller";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: "../.env" }),

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
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Article]),
  ],
  controllers: [ArticleProcessorController],
  providers: [ArticleProcessorService],
})
export class AppModule {}
