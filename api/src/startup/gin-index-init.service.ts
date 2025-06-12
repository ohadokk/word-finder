import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class GinIndexInitService implements OnApplicationBootstrap {
  constructor(private dataSource: DataSource) {}

  async onApplicationBootstrap() {
    await this.dataSource.query(
      `CREATE INDEX IF NOT EXISTS idx_article_body_tsvector ON article USING GIN (body_tsvector);`
    );
  }
}