export interface IService<T> {
  create(item: T): Promise<T>;
  find(filter: Partial<T>): Promise<T[]>;
}
