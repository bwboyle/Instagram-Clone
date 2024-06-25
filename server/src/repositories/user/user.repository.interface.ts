import { Model } from "mongoose";
import { IUser } from "../../models/user.model";

export interface IRepository {
  create(item: IUser): Promise<IUser>;
}
