import { Model } from "mongoose";
import { IRepository } from "./repository.interface";

export default class Repository<T extends Document> implements IRepository<T> {
  constructor(private readonly model: Model<T>) {}

  async create(item: T): Promise<T> {
    const newItem = new this.model(item);
    return newItem.save();
  }

  async find(filter: Partial<T>): Promise<T[]> {
    return await this.model.find(filter).exec();
  }
}
