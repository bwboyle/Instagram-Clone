import Repository from "../repositories/repository";
import { IService } from "./service.interface";

export default class Service<T extends Document> implements IService<T> {
  constructor(private readonly repository: Repository<T>) {}

  async create(item: T): Promise<T> {
    return await this.repository.create(item);
  }
  async find(filter: Partial<T>): Promise<T[]> {
    return await this.repository.find(filter);
  }
}
