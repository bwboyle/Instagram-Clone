import { Model } from "mongoose";
import { IUser } from "../models/user.model";

export interface IService {
  create(item: IUser): Promise<IUser>;
}
