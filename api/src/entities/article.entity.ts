import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
  JoinColumn
} from "typeorm";
import { User } from "./user.entity";
import { Comment } from "./comment.entity";

@Entity()
export class Article {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: false })
  body!: string;

  @Column({ type: 'tsvector', select: false, nullable: true })
  body_tsvector?: string;

  @ManyToOne(() => User, (user) => user.articles, { eager: true })
  @JoinColumn()
  author!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Comment, (comment: Comment) => comment.article)
  comments?: Comment[];

  @Column("jsonb", { nullable: false, default: {} })
  wordOffsets?: Record<string, number[]>;

  @Column("jsonb", { nullable: false, default: {} })
  wordFrequencies?: Record<string, number>;
}
