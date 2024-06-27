import { Request, Response } from "express";
import { IUser } from "../../models/user.model";
import { IController } from "../controller.interface";
import UserService from "../../services/user/user.service";
import { errorHandler } from "../../utils/error.utils";

export default class UserController implements IController<IUser> {
  constructor(private readonly userService: UserService) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      // Attempt to create new user, return JSON data if successful
      const newUser = await this.userService.create(req.body);
      res.status(200).json(newUser);
    } catch (error) {
      // Get status code and message from error handler
      const [status, message] = errorHandler(error as unknown as Error);
      res.status(status).json({ error: message });
    }
  }
}
