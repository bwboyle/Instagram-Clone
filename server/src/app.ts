import bodyParser from "body-parser";
import express from "express";
import UserController from "./controllers/user/user.controller";
import UserService from "./services/user/user.service";
import UserRepository from "./repositories/user/user.repository";
import { User } from "./models/user.model";

const app = express();

/* Middleware */
app.use(bodyParser.json());

/* Repositories, Services, and Controllers */
const userService = new UserService(new UserRepository(User));
const userController = new UserController(userService);

/* Routes */
app.post("/api/user", (req, res) => {
  userController.create(req, res);
});

app.get("/api/user", (req, res) => {
  userController.login(req, res);
});

export default app;
