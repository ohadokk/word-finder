import { ArticleRepository } from "./article.repository";
import { Repository } from "typeorm";
import { Article } from "../entities/article.entity";
import { User } from "../entities/user.entity";
import { CreateArticleDto } from "../dto/create-article.dto";

const mockUser = (id: string, name: string): User => ({
  id,
  name,
  email: `${name}@example.com`,
  articles: [],
  comments: [],
  createdAt: new Date(),
});

const mockArticle = (id: string, title: string, author: User): Article => ({
  id,
  title,
  body: `Body of ${title}`,
  author,
  comments: [],
  createdAt: new Date(),
  wordOffsets: {},
  wordFrequencies: {},
});

describe("ArticleRepository", () => {
  let repo: jest.Mocked<Repository<Article>>;
  let articleRepository: ArticleRepository;

  beforeEach(() => {
    repo = {
      createQueryBuilder: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as any;
    articleRepository = new ArticleRepository(repo as any);
  });

  it("findOneWithRelationsDto calls query builder with correct params", async () => {
    const qb: any = {
      leftJoin: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawOne: jest
        .fn()
        .mockResolvedValue({
          id: "a1",
          title: "T",
          body: "B",
          author: {},
          comments: [],
        }),
    };
    repo.createQueryBuilder.mockReturnValue(qb);

    const result = await articleRepository.findOneWithRelationsDto("a1");
    expect(repo.createQueryBuilder).toHaveBeenCalledWith("article");
    expect(qb.leftJoin).toHaveBeenCalledWith("article.author", "author");
    expect(qb.leftJoin).toHaveBeenCalledWith("article.comments", "comment");
    expect(qb.select).toHaveBeenCalled();
    expect(qb.where).toHaveBeenCalledWith("article.id = :id", { id: "a1" });
    expect(qb.groupBy).toHaveBeenCalled();
    expect(qb.getRawOne).toHaveBeenCalled();
    expect(result).toEqual({
      id: "a1",
      title: "T",
      body: "B",
      author: {},
      comments: [],
    });
  });

  it("findAllWithRelationsDto calls query builder and returns array", async () => {
    const qb: any = {
      leftJoin: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([{ id: "a1" }, { id: "a2" }]),
    };
    repo.createQueryBuilder.mockReturnValue(qb);

    const result = await articleRepository.findAllWithRelationsDto();
    expect(repo.createQueryBuilder).toHaveBeenCalledWith("article");
    expect(qb.leftJoin).toHaveBeenCalledWith("article.author", "author");
    expect(qb.leftJoin).toHaveBeenCalledWith("article.comments", "comment");
    expect(qb.select).toHaveBeenCalled();
    expect(qb.groupBy).toHaveBeenCalled();
    expect(qb.getRawMany).toHaveBeenCalled();
    expect(result).toEqual([{ id: "a1" }, { id: "a2" }]);
  });

  it("getArticlesByWord builds correct query", async () => {
    const qb: any = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([{ id: "a1" }]),
    };
    repo.createQueryBuilder.mockReturnValue(qb);

    const result = await articleRepository.getArticlesByWord("hello");
    expect(repo.createQueryBuilder).toHaveBeenCalledWith("article");
    expect(qb.where).toHaveBeenCalledWith(
      `article.body_tsvector @@ to_tsquery('english', :query_word)`,
      { query_word: "hello" }
    );
    expect(qb.andWhere).toHaveBeenCalledWith("article.wordOffsets IS NOT NULL");
    expect(qb.getMany).toHaveBeenCalled();
    expect(result).resolves;
  });

  it("getArticlesByWords builds correct query", async () => {
    const qb: any = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([{ id: "a1" }, { id: "a2" }]),
    };
    repo.createQueryBuilder.mockReturnValue(qb);

    const result = await articleRepository.getArticlesByWords([
      "hello",
      "world",
    ]);
    expect(repo.createQueryBuilder).toHaveBeenCalledWith("article");
    expect(qb.where).toHaveBeenCalledWith(
      `article.body_tsvector @@ to_tsquery('english', :tsquery)`,
      { tsquery: "hello | world" }
    );
    expect(qb.andWhere).toHaveBeenCalledWith("article.wordOffsets IS NOT NULL");
    expect(qb.getMany).toHaveBeenCalled();
    expect(result).resolves;
  });

  it("save creates and saves an article", async () => {
    const user = mockUser("u1", "alice");
    const dto: CreateArticleDto = {
      title: "Test Title",
      body: "Test Body",
      authorId: user.id,
    };
    const article = mockArticle("a1", dto.title, user);

    repo.create.mockReturnValue(article);
    repo.save.mockResolvedValue(article);

    const result = await articleRepository.save(user, dto);

    expect(repo.create).toHaveBeenCalledWith({ ...dto, author: user });
    expect(repo.save).toHaveBeenCalledWith(article);
    expect(result).toEqual(article);
  });
});
