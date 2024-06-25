export interface IService<T> {
  create(item: T): Promise<T>;
}
