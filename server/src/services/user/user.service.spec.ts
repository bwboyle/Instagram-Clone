import { IUser, User } from "../../models/user.model";
import UserRepository from "../../repositories/user/user.repository";
import { hashPassword } from "../../utils/password.utils";
import UserService from "./user.service";

describe("User Service", () => {
  const testUserData = {
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
    test("should create a new user with salted password", async () => {
      // Mock userRepository.create to return array containing test user
      userRepository.create = jest.fn().mockResolvedValue(testUser);

      const result = await userService.create(testUser);
      expect(result.name).toEqual(testUser.name);
      expect(result.email).toEqual(result.email);
      // Password should be hashed
      expect(result.password).not.toEqual("password123");
    });
  });

  describe("login", () => {
    test("should login user with correct credentials", async () => {
      // Mock userRepository.find to return array containing test user
      userRepository.find = jest.fn().mockResolvedValue([testUser]);

      const result = await userService.login(testUser.email, "password123");
      expect(result).toEqual(testUser);
    });
  });
});
