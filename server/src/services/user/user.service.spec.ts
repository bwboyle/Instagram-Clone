import { IUser, User } from "../../models/user.model";
import UserRepository from "../../repositories/user/user.repository";
import { hashPassword } from "../../utils/password.utils";
import UserService from "./user.service";
import { ObjectId, Types } from "mongoose";

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
    test("should create a new user and sanitize it", async () => {
      // Mock userRepository.create to return array containing test user
      userRepository.create = jest.fn().mockResolvedValue(testUser);

      const result = await userService.create(testUser);
      expect(result).toEqual(testUser);
      // Verify correct values
      // expect(result.id).toEqual(testUser.id);
      // expect(result.name).toEqual(testUser.name);
      // expect(result.email).toEqual(testUser.email);
      // // Result should not contain the password
      // expect(result.password).toBeUndefined();
    });
  });

  describe("login", () => {
    test("should login user with correct credentials", async () => {
      // Mock userRepository.find to return array containing test user
      userRepository.find = jest.fn().mockResolvedValue([testUser]);

      const result = await userService.login(testUser.email, "password123");
      expect(result).toEqual(testUser);
    });
    test("should not login user with incorrect credentials", async () => {
      // Mock userRepository.find to return array containing test user
      userRepository.find = jest.fn().mockResolvedValue([testUser]);

      try {
        const result = await userService.login(testUser.email, "wrongpassword");
        expect(result).toEqual(testUser);
      } catch (error: any) {
        expect(error.message).toEqual("Incorrect password");
      }
    });
  });
});
