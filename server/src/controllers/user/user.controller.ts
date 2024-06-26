import { Request, Response } from "express";
import UserService from "../../services/user/user.service";
import { errorHandler } from "../../utils/error/error.utils";
import { generateToken } from "../../utils/jwt/jwt.utils";

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
      const email = req.body.email;
      const password = req.body.password;
      const user = await this.userService.login(email, password);
      // Respond with JWT
      res.status(200).json({ token: generateToken(user) });
    } catch (error: any) {
      // Get status code and message from error handler
      errorHandler(res, error);
    }
  }

  async find(req: Request, res: Response) {
    // const params = req.url.split("?")[1].toString();
    // console.log(params);
    const { user, ...params } = req.body;
    const result = await this.userService.find(params);
    console.log(result);
    res.status(200).json("ok");
    // await verifyToken(req.headers.authorization)
    // console.log(req.headers);
    // res.status(200).json("ok");
  }
}
