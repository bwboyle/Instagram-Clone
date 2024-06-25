import { Model } from "mongoose";
import { IUser } from "../models/user.model";

export interface IRepository<T> {
  create(item: T): Promise<T>;
}
