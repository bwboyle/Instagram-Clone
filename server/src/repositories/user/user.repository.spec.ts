import { IUser, User } from "../../models/user.model";
import UserRepository from "./user.repository";
import { Types } from "mongoose";

// Create a mocking of the user model for testing
jest.mock("../../models/user.model");

describe("User Repository", () => {
  let userRepository: UserRepository;
  let testUser: IUser = {
    id: new Types.ObjectId(),
    name: "John Doe",
    email: "john@email.com",
    password: "password123",
  };

  beforeAll(async () => {
    userRepository = new UserRepository(User);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("create", () => {
    test("should create a new user", async () => {
      // Mock new User.create() to return the test user
      User.create = jest.fn().mockResolvedValue(testUser);

      const result = await userRepository.create(testUser);
      expect(result).toEqual(testUser);
    });

    test("should throw error if user already exists", async () => {
      // Mock User.create() to throw duplicate key error
      User.create = jest.fn().mockRejectedValue(Error("E11000 duplicate key"));

      try {
        await userRepository.create(testUser);
      } catch (error: any) {
        expect(error.message).toContain("E11000 duplicate key");
      }
    });

    test("should throw error if user data is invalid", async () => {
      // Mock User.save() to throw validation error
      User.create = jest
        .fn()
        .mockRejectedValue(Error("User validation failed"));

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
    test("should find multiple users with the same name", async () => {
      User.find = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([testUser, testUser]),
      });

      const users = await userRepository.find({ name: testUser.name });
      expect(users.length).toEqual(2);
      expect(users[0].name).toEqual(users[1].name);
    });
  });

  describe("findOne", () => {
    test("should find one user with the the given email", async () => {
      User.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(testUser),
      });

      const user = await userRepository.findOne({ email: testUser.email });
      // expect(users.length).toEqual(2);
      expect(user).not.toBeNull();
      expect(user?.name).toEqual(testUser.name);
    });
  });
});
