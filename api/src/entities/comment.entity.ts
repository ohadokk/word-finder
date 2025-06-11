import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn
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
  @JoinColumn()
  article!: Article;

  @ManyToOne(() => User, (user) => user.comments, { eager: true })
  @JoinColumn()
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;
}
