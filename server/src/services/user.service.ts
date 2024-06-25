import { Model, MongooseError } from "mongoose";
import { IUser, User } from "../models/user.model";
import { IService } from "./user.service.interface";

export default class UserService implements IService {
  constructor(private readonly userModel: Model<IUser>) {}

  async create(userData: IUser): Promise<IUser> {
    try {
      const newUser = new this.userModel(userData);
      return newUser.save();
    } catch (error) {
      throw error;
    }
  }
}
