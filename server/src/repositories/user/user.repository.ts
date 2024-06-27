import { FilterQuery, Model, MongooseError } from "mongoose";
import { IUser, User } from "../../models/user.model";
import { IRepository } from "../repository.interface";

export default class UserRepository implements IRepository<IUser> {
  private readonly userModel: Model<IUser>;
  constructor() {
    this.userModel = User;
  }

  async create(user: IUser): Promise<IUser> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async find(filter: Partial<IUser>): Promise<IUser[]> {
    return await this.userModel.find(filter).exec();
  }
}
