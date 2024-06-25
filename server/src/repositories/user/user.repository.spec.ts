import DbConfig from "../../configs/db.config";
import UserRepository from "./user.repository";
import { User } from "../../models/user.model";
import { MongooseError } from "mongoose";

describe("User Repository", () => {
  let userRepository: UserRepository;
  let userData = {
    name: "John Doe",
    email: "john@email.com",
    password: "password123",
  };
  beforeAll(async () => {
    await DbConfig.connect("test");
    userRepository = new UserRepository(User);
  });

  afterAll(async () => {
    // Drop all created objects from the test database
    await User.deleteMany({});
    await DbConfig.disconnect();
  });

  test("should create a new user", async () => {
    const result = await userRepository.create(userData);
    expect(result.email).toEqual(userData.email);
    expect(result.name).toEqual(userData.name);
  });

  test("should thhrow error if user already exists", async () => {
    // Email must be unique for each user
    try {
      const result = await userRepository.create(userData);
    } catch (error: any) {
      expect(error.message).toContain("E11000 duplicate key");
    }
  });

  test("should throw error if user data is invalid", async () => {
    userData.name = "";
    userData.email = "";
    userData.password = "";

    try {
      const result = await userRepository.create(userData);
    } catch (error: any) {
      expect(error.message).toContain("User validation failed");
    }
  });
});
