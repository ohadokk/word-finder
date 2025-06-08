import { CommentService } from "../services/comment.service";
import { CreateCommentDto } from "../dto/create-comment.dto";
export declare class CommentController {
    private readonly commentService;
    constructor(commentService: CommentService);
    create(dto: CreateCommentDto): Promise<import("../entities/comment.entity").Comment>;
    findOne(id: string): Promise<import("../entities/comment.entity").Comment | null>;
}
