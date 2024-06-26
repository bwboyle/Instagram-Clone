import { Request, Response } from "express";
import { IUser } from "../../models/user.model";
import { IController } from "../controller.interface";
import UserService from "../../services/user/user.service";

export default class UserController implements IController<IUser> {
  constructor(private readonly userService: UserService) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const newUser = await this.userService.create(req.body);
      console.log(newUser);
      res.status(200).json({});
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
