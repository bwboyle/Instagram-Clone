import { IUser } from "../../models/user.model";
import { IService } from "../service.interface";
import UserRepository from "../../repositories/user/user.repository";
import { hashPassword, validPassword } from "../../utils/password.utils";
import Service from "../service";

export default class UserService extends Service<IUser> {
  async create(user: IUser): Promise<IUser> {
    // Salt password before saving user
    user.password = await hashPassword(user.password);
    return super.create(user);
  }

  async login(email: string, password: string): Promise<IUser> {
    const user = (await super.find({ email: email }))[0];

    // If password is correct, return user
    if (user) {
      if (await validPassword(user.password, password)) {
        return user;
      }
      throw new Error("Incorrect password");
    } else {
      throw new Error("User does not exist");
    }

    // Otherwise, throw error
  }
}
