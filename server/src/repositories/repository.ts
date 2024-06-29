import { Model } from "mongoose";
import { IRepository } from "./repository.interface";

export default class Repository<T> implements IRepository<T> {
  constructor(private readonly model: Model<T>) {}

  async create(item: T): Promise<T> {
    return await this.model.create(item);
  }

  async findOne(filter: Partial<T>): Promise<T | null> {
    return await this.model.findOne(filter).exec();
  }

  async find(filter: Partial<T>): Promise<T[]> {
    // Filter object for pattern matching
    const patternFilter = this.getPatternFilter(filter);
    return await this.model.find(patternFilter).exec();
  }

  private getPatternFilter(filter: Partial<T>): any {
    const patternFilter: any = {};

    for (const key in filter) {
      if (filter[key] && typeof filter[key] === "string") {
        // If the filter value is a string, use regex for pattern matching
        patternFilter[key] = { $regex: filter[key], $options: "i" }; // 'i' for case-insensitive
      } else {
        // Otherwise, use exact match
        patternFilter[key] = filter[key];
      }
    }

    return patternFilter;
  }
}
