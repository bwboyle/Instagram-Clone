import { Request, Response } from "express";
import { IUser } from "../../models/user.model";
import { IController } from "../controller.interface";
import UserService from "../../services/user/user.service";
import { errorHandler } from "../../utils/error.utils";
import { generateToken } from "../../utils/jwt.utils";

export default class UserController {
  constructor(private readonly userService: UserService) {}

  async signup(req: Request, res: Response): Promise<void> {
    try {
      // Attempt to create new user, return JSON data if successful
      const newUser = await this.userService.signup(req.body);
      // Return JWT
      res.status(200).json({ token: generateToken(newUser) });
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
      res.status(200).json({ token: generateToken(user) });
    } catch (error: any) {
      // Get status code and message from error handler
      errorHandler(res, error);
    }
  }

  async search(req: Request, res: Response) {
    console.log(req.headers);
    res.status(200).json("ok");
  }
}
