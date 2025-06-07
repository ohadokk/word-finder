import { Article } from "./article.entity";
import { Comment } from "./comment.entity";
export declare class User {
    id: string;
    name: string;
    email: string;
    articles: Article[];
    comments: Comment[];
    createdAt: Date;
}
