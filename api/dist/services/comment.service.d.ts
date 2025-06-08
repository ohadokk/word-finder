import { Repository } from "typeorm";
import { Comment } from "../entities/comment.entity";
import { Article } from "../entities/article.entity";
import { User } from "../entities/user.entity";
import { CreateCommentDto } from "../dto/create-comment.dto";
export declare class CommentService {
    private commentRepo;
    private articleRepo;
    private userRepo;
    constructor(commentRepo: Repository<Comment>, articleRepo: Repository<Article>, userRepo: Repository<User>);
    create(dto: CreateCommentDto): Promise<Comment>;
    findOne(id: string): Promise<Comment | null>;
}
