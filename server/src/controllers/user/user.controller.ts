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
      // Return JWT
      res.status(200).json({ token: this.userService.generateToken(newUser) });
    } catch (error: any) {
      // Get status code and message from error handler
      errorHandler(res, error);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.login(
        req.body.email,
        req.body.password
      );
      // Respond with JWT
      res.status(200).json({ token: this.userService.generateToken(user) });
      // Respond with sanitized input and token
      // const response = {
      //   user: this.userService.sanitizeUser(user),
      //   token: this.userService.generateToken(user),
      // };
      // res.status(200).json(user);
    } catch (error: any) {
      // Get status code and message from error handler
      errorHandler(res, error);
    }
  }
}
