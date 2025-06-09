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

  @Column("jsonb", { nullable: false, default: {} })
  wordOffsets!: Record<string, number[]>;


  @Column("jsonb", { nullable: false, default: {} })
  wordFrequencies!: Record<string, number>;
}
