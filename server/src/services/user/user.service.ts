import { IUser, User } from "../../models/user.model";
import { IService } from "../service.interface";
import UserRepository from "../../repositories/user/user.repository";
import { hashPassword, validPassword } from "../../utils/password.utils";
import Service from "../service";
import { configDotenv } from "dotenv";
import { sign, verify } from "jsonwebtoken";
import { Model } from "mongoose";

export default class UserService extends Service<IUser> {
  async signup(user: IUser): Promise<IUser> {
    // Salt password before creating
    user.password = await hashPassword(user.password);
    return super.create(user);
  }

  async login(email: string, password: string): Promise<IUser> {
    const user = (await super.find({ email: email }))[0];

    if (!user) {
      throw Error("User does not exist");
    }

    if (!(await validPassword(user.password, password))) {
      throw Error("Incorrect password");
    }

    // If password is correct, return user
    return user;
  }
}
