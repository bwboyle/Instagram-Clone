import { Request, Response } from "express";

export interface IController<T> {
  create(req: Request, res: Response): Promise<void>;
}
