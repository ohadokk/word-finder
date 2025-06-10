import { User } from "./user.entity";
import { Comment } from "./comment.entity";
export declare class Article {
    id: string;
    title: string;
    body: string;
    body_tsvector?: string;
    author: User;
    createdAt: Date;
    comments?: Comment[];
    wordOffsets: Record<string, number[]>;
    wordFrequencies: Record<string, number>;
}
