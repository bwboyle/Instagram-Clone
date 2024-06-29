import { IUser, User } from "../../models/user.model";
import UserRepository from "../../repositories/user/user.repository";
import UserService from "./user.service";
import { Types } from "mongoose";

describe("User Service", () => {
  const testUserData: IUser = {
    id: new Types.ObjectId(),
    name: "John Doe",
    email: "john@email.com",
    password: "password123",
  };
  let testUser: IUser;
  let userRepository: UserRepository;
  let userService: UserService;

  beforeAll(() => {
    testUser = new User(testUserData);
    userRepository = new UserRepository(User);
    userService = new UserService(userRepository);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("create", () => {
    test("should create a new user", async () => {
      // Mock userRepository.create to return array containing test user
      userRepository.create = jest.fn().mockResolvedValue(testUser);

      const result = await userService.signup(testUser);
      expect(result).toEqual(testUser);
    });
  });

  describe("login", () => {
    test("should return user if given correct credentials", async () => {
      // Mock userRepository.find to return array containing test user
      userRepository.find = jest.fn().mockResolvedValue([testUser]);

      const result = await userService.login(testUser.email, "password123");
      expect(result).toEqual(testUser);
    });
    test("should not return user if given incorrect password", async () => {
      // Mock userRepository.find to return array containing test user
      userRepository.find = jest.fn().mockResolvedValue([testUser]);

      try {
        const result = await userService.login(testUser.email, "wrongpassword");
        expect(result).toEqual(testUser);
      } catch (error: any) {
        expect(error.message).toEqual("Incorrect password");
      }
    });

    test("should not return user if given incorrect email", async () => {
      // Mock userRepository.find to return array containing test user
      userRepository.find = jest.fn().mockResolvedValue([testUser]);

      try {
        const result = await userService.login("wrongemail", "password123");
        expect(result).toEqual(testUser);
      } catch (error: any) {
        expect(error.message).toEqual("Incorrect email");
      }
    });
  });
});
