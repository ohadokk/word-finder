import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from "typeorm";


@Entity()
export class Article {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: 'tsvector', select: false, nullable: true })
  body_tsvector?: string;

  @Column("jsonb", { nullable: true, default: {} })
  wordOffsets?: Record<string, number[]>;


  @Column("jsonb", { nullable: true, default: {} })
  wordFrequencies?: Record<string, number>;
}
