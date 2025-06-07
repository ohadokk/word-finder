import { Controller, Post, Get, Param, Body } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { CreateUserDto } from "../dto/create-user.dto";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.findOne(id);
  }
}
