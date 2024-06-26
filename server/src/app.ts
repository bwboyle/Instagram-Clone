import bodyParser from "body-parser";
import express from "express";
import UserController from "./controllers/user/user.controller";
import UserService from "./services/user/user.service";
import UserRepository from "./repositories/user/user.repository";

const app = express();

/* Middleware */
app.use(bodyParser.json());

/* Repositories, Services, and Controllers */
const userService = new UserService(new UserRepository());
const userController = new UserController(userService);

/* Routes */
app.post("/api/user", (req, res) => {
  userController.create(req, res);
});

export default app;
