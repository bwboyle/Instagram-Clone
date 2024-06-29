import bodyParser from "body-parser";
import express from "express";
import UserController from "./controllers/user/user.controller";
import UserService from "./services/user/user.service";
import UserRepository from "./repositories/user/user.repository";
import { User } from "./models/user.model";
import { authenticate } from "./utils";

const app = express();

/* Middleware */
app.use(bodyParser.json());

/* Repositories, Services, and Controllers */
const userService = new UserService(new UserRepository(User));
const userController = new UserController(userService);

/* Routes */
app.post("/api/user", (req, res) => {
  userController.signup(req, res);
});

app.get("/api/user", (req, res) => {
  userController.login(req, res);
});

app.post("/api/user/find", authenticate, (req, res) => {
  userController.find(req, res);
});

export default app;
