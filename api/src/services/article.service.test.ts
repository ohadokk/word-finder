import { ArticleService } from "./article.service";
import { ArticleRepository } from "../repositories/article.repository";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { RedisService } from "../redis.service";

// Helper to create a mock User with all required fields
const mockUser = (id: string, name: string): User => ({
  id,
  name,
  email: `${name}@example.com`,
  articles: [],
  comments: [],
  createdAt: new Date("2023-01-01T12:00:00.000Z"),
});

describe("ArticleService - findWords (offsets)", () => {
  let articleService: ArticleService;
  let articleRepo: jest.Mocked<ArticleRepository>;
  let userRepo: jest.Mocked<Repository<User>>;
  let publisher: jest.Mocked<RedisService>;

  beforeEach(() => {
    articleRepo = {
      getArticlesByWords: jest.fn(),
    } as any;
    userRepo = {} as any;
    publisher = {} as any;
    articleService = new ArticleService(articleRepo, userRepo, publisher);
  });

  it("returns offsets for articles containing the searched words", async () => {
    articleRepo.getArticlesByWords.mockResolvedValue([
      {
        id: "a1",
        title: "First Article",
        body: "Hello world! This is the first article. Hello again!",
        author: mockUser("u1", "alice"),
        createdAt: new Date("2023-01-02T10:00:00.000Z"),
        wordOffsets: {
          hello: [0, 8],
          world: [1],
        },
      },
      {
        id: "a2",
        title: "Second Article",
        body: "Hello from the second article.",
        author: mockUser("u2", "bob"),
        createdAt: new Date("2023-01-03T11:00:00.000Z"),
        wordOffsets: {
          hello: [0],
        },
      },
    ]);
    const result = await articleService.findWords(["hello", "world"]);
    expect(result).toEqual({
      hello: [
        { article_id: "a1", offsets: [0, 8] },
        { article_id: "a2", offsets: [0] },
      ],
      world: [
        { article_id: "a1", offsets: [1] },
      ],
    });
  });

  it("returns empty object if no articles contain the words", async () => {
    articleRepo.getArticlesByWords.mockResolvedValue([
      {
        id: "a3",
        title: "Third Article",
        body: "No relevant words here.",
        author: mockUser("u3", "carol"),
        createdAt: new Date("2023-01-04T09:00:00.000Z"),
        wordOffsets: { foo: [2] },
      },
    ]);
    const result = await articleService.findWords(["bar"]);
    expect(result).toEqual({});
  });

  it("handles articles with undefined wordOffsets", async () => {
    articleRepo.getArticlesByWords.mockResolvedValue([
      {
        id: "a4",
        title: "Fourth Article",
        body: "This article has no word offsets.",
        author: mockUser("u4", "dave"),
        createdAt: new Date("2023-01-05T08:00:00.000Z"),
      },
    ]);
    const result = await articleService.findWords(["hello"]);
    expect(result).toEqual({});
  });

  it("is case-insensitive for searched words", async () => {
    articleRepo.getArticlesByWords.mockResolvedValue([
      {
        id: "a5",
        title: "Fifth Article",
        body: "HELLO in uppercase.",
        author: mockUser("u5", "eve"),
        createdAt: new Date("2023-01-06T07:00:00.000Z"),
        wordOffsets: { hello: [0] },
      },
    ]);
    const result = await articleService.findWords(["HeLLo"]);
    expect(result).toEqual({
      hello: [{ article_id: "a5", offsets: [0] }],
    });
  });

  it("does not include words with empty offsets", async () => {
    articleRepo.getArticlesByWords.mockResolvedValue([
      {
        id: "a6",
        title: "Sixth Article",
        body: "This article mentions hello, but no offsets.",
        author: mockUser("u6", "frank"),
        createdAt: new Date("2023-01-07T06:00:00.000Z"),
        wordOffsets: { hello: [] },
      },
    ]);
    const result = await articleService.findWords(["hello"]);
    expect(result).toEqual({});
  });
});