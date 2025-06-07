import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { CreateUserDto } from "../dto/create-user.dto";
export declare class UserService {
    private userRepo;
    constructor(userRepo: Repository<User>);
    create(dto: CreateUserDto): Promise<User>;
    findOne(id: string): Promise<User | null>;
}
