import { IUser } from "../../models/user.model";
import { IService } from "../service.interface";
import UserRepository from "../../repositories/user/user.repository";

export default class UserService implements IService<IUser> {
  constructor(private userRepository: UserRepository) {}
  async create(user: IUser): Promise<IUser> {
    // TODO: Salt password before saving new user
    return await this.userRepository.create(user);
  }
}
