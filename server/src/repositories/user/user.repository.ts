import { Model, MongooseError } from "mongoose";
import { IUser, User } from "../../models/user.model";
import { IRepository } from "../repository.interface";

export default class UserRepository implements IRepository<IUser> {
  private readonly userModel: Model<IUser>;
  constructor() {
    this.userModel = User;
  }

  async create(userData: IUser): Promise<IUser> {
    console.log(userData);
    const newUser = new this.userModel(userData);
    return newUser.save();
  }
}
