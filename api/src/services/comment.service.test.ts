import { CommentService } from "./comment.service";
import { Repository } from "typeorm";
import { Comment } from "../entities/comment.entity";
import { Article } from "../entities/article.entity";
import { User } from "../entities/user.entity";
import { CreateCommentDto } from "../dto/create-comment.dto";

const mockUser = (id: string, name: string): User => ({
  id,
  name,
  email: `${name}@example.com`,
  articles: [],
  comments: [],
  createdAt: new Date("2023-01-01T12:00:00.000Z"),
});

const mockArticle = (id: string, title: string, author: User): Article => ({
  id,
  title,
  body: `Body of ${title}`,
  author,
  comments: [],
  createdAt: new Date("2023-01-02T10:00:00.000Z"),
  wordOffsets: {},
  wordFrequencies: {},
});

const mockComment = (
  id: string,
  content: string,
  user: User,
  article: Article
): Comment => ({
  id,
  content,
  user,
  article,
  createdAt: new Date("2023-01-03T09:00:00.000Z"),
});

describe("CommentService", () => {
  let commentService: CommentService;
  let commentRepo: jest.Mocked<Repository<Comment>>;
  let articleRepo: jest.Mocked<Repository<Article>>;
  let userRepo: jest.Mocked<Repository<User>>;

  beforeEach(() => {
    commentRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    } as any;
    articleRepo = {
      findOneByOrFail: jest.fn(),
    } as any;
    userRepo = {
      findOneByOrFail: jest.fn(),
    } as any;
    commentService = new CommentService(commentRepo, articleRepo, userRepo);
  });

  it("creates a comment and returns the response dto", async () => {
    const user = mockUser("u1", "alice");
    const article = mockArticle("a1", "First Article", user);
    const dto: CreateCommentDto = { content: "Great read!", userId: "u1", articleId: "a1" };
    const comment = mockComment("c1", dto.content, user, article);

    userRepo.findOneByOrFail.mockResolvedValue(user);
    articleRepo.findOneByOrFail.mockResolvedValue(article);
    commentRepo.create.mockReturnValue(comment);
    commentRepo.save.mockResolvedValue({ ...comment, article });

    const result = await commentService.create(dto);

    expect(userRepo.findOneByOrFail).toHaveBeenCalledWith({ id: "u1" });
    expect(articleRepo.findOneByOrFail).toHaveBeenCalledWith({ id: "a1" });
    expect(commentRepo.create).toHaveBeenCalledWith({
      content: dto.content,
      user,
      article,
    });
    expect(commentRepo.save).toHaveBeenCalledWith(comment);
    expect(result).toEqual({
      id: "c1",
      content: "Great read!",
      articleId: "a1",
    });
  });

  it("finds a comment by id and returns the response dto", async () => {
    const user = mockUser("u2", "bob");
    const article = mockArticle("a2", "Second Article", user);
    const comment = mockComment("c2", "Interesting!", user, article);

    commentRepo.findOne.mockResolvedValue({ ...comment, article });

    const result = await commentService.findOne("c2");

    expect(commentRepo.findOne).toHaveBeenCalledWith({
      where: { id: "c2" },
      relations: ["article"],
    });
    expect(result).toEqual({
      id: "c2",
      content: "Interesting!",
      articleId: "a2",
    });
  });

  it("returns null if comment not found", async () => {
    commentRepo.findOne.mockResolvedValue(null);

    const result = await commentService.findOne("notfound");
    expect(result).toBeNull();
  });

  it("finds all comments by article id", async () => {
    const user = mockUser("u3", "carol");
    const article = mockArticle("a3", "Third Article", user);
    const comments = [
      mockComment("c3", "First comment", user, article),
      mockComment("c4", "Second comment", user, article),
    ];

    commentRepo.find.mockResolvedValue(comments);

    const result = await commentService.findAllByArticleId("a3");

    expect(commentRepo.find).toHaveBeenCalledWith({
      where: { article: { id: "a3" } },
      relations: ["article"],
      order: { createdAt: "ASC" },
    });
    expect(result).toEqual([
      { id: "c3", content: "First comment", articleId: "a3" },
      { id: "c4", content: "Second comment", articleId: "a3" },
    ]);
  });
});