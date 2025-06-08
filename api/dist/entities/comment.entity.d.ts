import { Article } from "./article.entity";
import { User } from "./user.entity";
export declare class Comment {
    id: string;
    content: string;
    article: Article;
    user: User;
    createdAt: Date;
}
