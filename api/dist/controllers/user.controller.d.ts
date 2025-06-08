import { UserService } from "../services/user.service";
import { CreateUserDto } from "../dto/create-user.dto";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(dto: CreateUserDto): Promise<import("../entities/user.entity").User>;
    findOne(id: string): Promise<import("../entities/user.entity").User | null>;
}
