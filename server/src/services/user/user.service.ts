import { FilterQuery } from "mongoose";
import { IUser } from "../../models/user.model";
import { hashPassword, validPassword } from "../../utils";
import Service from "../service";

export default class UserService extends Service<IUser> {
  async signup(user: IUser): Promise<IUser> {
    user.password = await hashPassword(user.password);
    return super.create(user);
  }

  async login(email: string, password: string): Promise<IUser> {
    const user = await super.findOne({ email: email });
    if (!user) {
      throw new Error("Incorrect email");
    }

    const passwordIsValid = await validPassword(user.password, password);
    if (!passwordIsValid) {
      throw new Error("Incorrect password");
    }

    return user;
  }

  async search(filter: FilterQuery<Partial<IUser>>): Promise<IUser[]> {
    throw new Error("Unimplemented");
  }
}
