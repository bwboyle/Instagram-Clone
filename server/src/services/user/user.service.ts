import { IUser, User } from "../../models/user.model";
import { IService } from "../service.interface";
import UserRepository from "../../repositories/user/user.repository";
import { hashPassword, validPassword } from "../../utils/password.utils";
import Service from "../service";
import { configDotenv } from "dotenv";
import { sign } from "jsonwebtoken";
import { Model } from "mongoose";

// Get JWT_SECRET from .env file
configDotenv();

export default class UserService extends Service<IUser> {
  async create(user: IUser): Promise<IUser> {
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

    // if (user) {
    //   if (await validPassword(user.password, password)) {
    //     return user;
    //   }
    //   throw new Error("Incorrect password");
    // } else {
    //   throw new Error("User does not exist");
    // }
  }

  // // Santize user by removing password from object
  // sanitizeUser(user: IUser) {
  //   return { id: user.id, name: user.name, email: user.email };
  // }

  // Creates a JWT token for the given user
  generateToken(user: IUser): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }
    const payload = { id: user.id, email: user.email };
    return sign(payload, secret, { expiresIn: "1h" });
  }
}
