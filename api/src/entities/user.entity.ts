import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { Article } from "./article.entity";
import { Comment } from "./comment.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @OneToMany(() => Article, (article) => article.author)
  articles!: Article[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments!: Comment[];

  @CreateDateColumn()
  createdAt!: Date;
}
