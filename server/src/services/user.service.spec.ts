import DbConfig from "../configs/db.config";
import UserService from "./user.service";
import { User } from "../models/user.model";
import { MongooseError } from "mongoose";

describe("User Service", () => {
  let userService: UserService;
  let userData = {
    name: "John Doe",
    email: "john@email.com",
    password: "password123",
  };
  beforeAll(async () => {
    await DbConfig.connect("test");
    userService = new UserService(User);
  });

  afterAll(async () => {
    // Drop all created objects from the test database
    await User.deleteMany({});
    await DbConfig.disconnect();
  });

  test("should create a new user", async () => {
    const result = await userService.create(userData);
    expect(result.email).toEqual(userData.email);
    expect(result.name).toEqual(userData.name);
  });

  test("should not create a new user if it already exists", async () => {
    // Email must be unique for each user
    try {
      const result = await userService.create(userData);
    } catch (error: any) {
      expect(error.message).toContain("E11000 duplicate key");
    }
  });

  test("should not create a new user if given invalid data", async () => {
    userData.name = "";
    userData.email = "";
    userData.password = "";
    // Email must be unique for each user
    try {
      const result = await userService.create(userData);
    } catch (error: any) {
      expect(error.message).toContain("User validation failed");
    }
  });
});
