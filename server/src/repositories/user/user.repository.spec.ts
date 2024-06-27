import DbConfig from "../../configs/db.config";
import { IUser, User } from "../../models/user.model";
import UserRepository from "./user.repository";

// Create a mocking of the user model for testing
jest.mock("../../models/user.model");

describe("User Repository", () => {
  let userRepository: UserRepository;
  let testUser = {
    name: "John Doe",
    email: "john@email.com",
    password: "password123",
  } as unknown as IUser;

  beforeAll(async () => {
    userRepository = new UserRepository(User);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("create", () => {
    test("should create a new user", async () => {
      // Mock new User.save() to return the test user
      (User as unknown as jest.Mock).mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(testUser),
      }));

      const result = await userRepository.create(testUser);
      expect(result.email).toEqual(testUser.email);
      expect(result.name).toEqual(testUser.name);
    });

    test("should throw error if user already exists", async () => {
      // Mock User.save() to throw duplicate key error
      (User as unknown as jest.Mock).mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(Error("E11000 duplicate key")),
      }));

      try {
        await userRepository.create(testUser);
      } catch (error: any) {
        expect(error.message).toContain("E11000 duplicate key");
      }
    });

    test("should throw error if user data is invalid", async () => {
      // Mock User.save() to throw validation error
      (User as unknown as jest.Mock).mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(Error("User validation failed")),
      }));

      const emptyUser = {
        name: "",
        email: "",
        password: "",
      } as unknown as IUser;

      try {
        await userRepository.create(emptyUser);
      } catch (error: any) {
        expect(error.message).toContain("User validation failed");
      }
    });
  });

  describe("find", () => {
    test("should only find one user when given email", async () => {
      // Mock User.find to return the test user
      User.find = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([testUser]),
      });

      const users = await userRepository.find({ email: testUser.email });
      expect(users.length).toEqual(1);
      expect(users[0]).toEqual(testUser);
    });
    test("should find multiple users with the same name", async () => {
      User.find = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([testUser, testUser]),
      });

      const users = await userRepository.find({ name: testUser.name });
      expect(users.length).toEqual(2);
      expect(users[0].name).toEqual(users[1].name);
    });
  });
});
