import { Model } from "mongoose";
import { IRepository } from "./repository.interface";

export default class Repository<T> implements IRepository<T> {
  constructor(private readonly model: Model<T>) {}

  async create(item: T): Promise<T> {
    return await this.model.create(item);
  }

  async find(filter: Partial<T>): Promise<T[]> {
    return await this.model.find(filter).exec();
  }
}
