import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ArticleProcessorService } from './article-processor.service'

@Controller()
export class ArticleProcessorController {
  constructor(private readonly service: ArticleProcessorService) {}

  @EventPattern('article_created')
  async handleArticleCreated(@Payload() data: { id: string; body: string }) {
    await this.service.process(data.id, data.body);
  }
}