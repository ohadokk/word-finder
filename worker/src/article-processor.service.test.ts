import { ArticleProcessorService } from "./article-processor.service";
import { Repository } from "typeorm";
import { Article } from "./entities/article.entity";

describe("ArticleProcessorService", () => {
  let service: ArticleProcessorService;
  let articleRepo: jest.Mocked<Repository<Article>>;

  beforeEach(() => {
    articleRepo = {
      update: jest.fn(),
    } as any;
    service = new ArticleProcessorService(articleRepo);
  });

  it("process updates article with correct wordOffsets and wordFrequencies", async () => {
    const id = "a1";
    const body = "Hello world! Hello again, world.";
    await service.process(id, body);

    // Expected wordOffsets and wordFrequencies
    const expectedOffsets = {
      hello: [0, 13],
      world: [6, 26],
      again: [19],
    };
    const expectedFrequencies = {
      hello: 2,
      world: 2,
      again: 1,
    };

    expect(articleRepo.update).toHaveBeenCalledWith(
      id,
      expect.objectContaining({
        wordOffsets: expectedOffsets,
        wordFrequencies: expectedFrequencies,
        body_tsvector: expect.any(Function),
      })
    );
  });

  it("buildOffsetMap returns correct offsets", () => {
    const body = "Test test TEST!";
    // @ts-expect-private: test private method
    // @ts-ignore
    const result = service.buildOffsetMap(body);
    expect(result).toEqual({ test: [0, 5, 10] });
  });

  it("buildWordFrequencyMap returns correct frequencies", () => {
    const body = "One two two three three three";
    // @ts-expect-private: test private method
    // @ts-ignore
    const result = service.buildWordFrequencyMap(body);
    expect(result).toEqual({ one: 1, two: 2, three: 3 });
  });
});
