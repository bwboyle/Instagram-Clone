import { FilterQuery, Model } from "mongoose";
import { IUser } from "../models/user.model";

export interface IRepository<T> {
  create(item: T): Promise<T>;
  find(filter: Partial<T>): Promise<T[]>;
  findOne(filter: Partial<T>): Promise<T | null>;
}
