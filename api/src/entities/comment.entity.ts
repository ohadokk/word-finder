import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Article } from "./article.entity";
import { User } from "./user.entity";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("text")
  content!: string;

  @ManyToOne(() => Article, (article) => article.comments, { eager: true })
  article!: Article;

  @ManyToOne(() => User, (user) => user.comments, { eager: true })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;
}
