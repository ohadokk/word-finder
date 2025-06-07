import { Controller, Post, Get, Param, Body } from "@nestjs/common";
import { CommentService } from "../services/comment.service";
import { CreateCommentDto } from "../dto/create-comment.dto";

@Controller("comments")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() dto: CreateCommentDto) {
    return this.commentService.create(dto);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.commentService.findOne(id);
  }
}
