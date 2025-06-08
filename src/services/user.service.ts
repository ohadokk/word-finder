import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { CreateUserDto } from "../dto/create-user.dto";

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  create(dto: CreateUserDto) {
    return this.userRepo.save(this.userRepo.create(dto));
  }

  findOne(id: string) {
    return this.userRepo.findOneBy({ id });
  }
}
