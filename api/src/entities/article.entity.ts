import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { User } from "./user.entity";
import { Comment } from "./comment.entity";

@Entity()
export class Article {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column("text")
  body!: string;

  @Column("jsonb", { nullable: false, default: {} })
  wordOffsets!: Record<string, number[]>;

  @ManyToOne(() => User, (user) => user.articles, { eager: true })
  author!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Comment, (comment: Comment) => comment.article)
  comments?: Comment[];

  @Column("jsonb", { nullable: false, default: {} })
  wordFrequencies!: Record<string, number>;
}
