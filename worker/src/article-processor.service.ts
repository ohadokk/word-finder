import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from "./entities/article.entity";



@Injectable()
export class ArticleProcessorService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
  ) {}

  async process(id: string, body: string) {
    const wordOffsets = this.buildOffsetMap(body);
    const wordFrequencies = this.buildWordFrequencyMap(body);
    console.log("here")
    await this.articleRepo.update(id, { wordOffsets, wordFrequencies });
  }

  private buildOffsetMap(body: string): Record<string, number[]> {
    const map: Record<string, number[]> = {};
    const lower = body.toLowerCase();
    const regex = /\b\w+\b/g;
    let match;
    while ((match = regex.exec(lower)) !== null) {
      const word = match[0];
      if (!map[word]) map[word] = [];
      map[word].push(match.index);
    }
    return map;
  }

  private buildWordFrequencyMap(body: string): Record<string, number> {
    const map: Record<string, number> = {};
    const words = body.toLowerCase().match(/\b\w+\b/g) || [];
    for (const word of words) {
      map[word] = (map[word] || 0) + 1;
    }
    return map;
  }
}