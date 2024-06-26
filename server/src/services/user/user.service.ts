import { IUser } from "../../models/user.model";
import { IService } from "../service.interface";
import UserRepository from "../../repositories/user/user.repository";
import { hashPassword } from "../../utils/password.utils";

export default class UserService implements IService<IUser> {
  constructor(private userRepository: UserRepository) {}

  async create(user: IUser): Promise<IUser> {
    // Salt password before saving new user
    user.password = await hashPassword(user.password);
    // const newUser = await this.userRepository.create(user);
    // newUser.password = await hashPassword(user.password);
    return await this.userRepository.create(user);
    // console.log(user);
    // return await this.userRepository.create(user);
  }
}
