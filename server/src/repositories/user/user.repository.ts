import { Model, MongooseError } from "mongoose";
import { IUser } from "../../models/user.model";
import { IRepository } from "./user.repository.interface";

export default class UserRepository implements IRepository {
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
