import { Model, MongooseError } from "mongoose";
import { IUser } from "../../models/user.model";
import { IRepository } from "../repository.interface";

export default class UserRepository implements IRepository<IUser> {
  constructor(private readonly userModel: Model<IUser>) {}

  async create(userData: IUser): Promise<IUser> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }
}
