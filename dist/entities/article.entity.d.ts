import { User } from "./user.entity";
import { Comment } from "./comment.entity";
export declare class Article {
    id: string;
    title: string;
    body: string;
    wordOffsets: Record<string, number[]>;
    author: User;
    createdAt: Date;
    comments?: Comment[];
}
