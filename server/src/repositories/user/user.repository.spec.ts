import DbConfig from "../../configs/db.config";
import { User } from "../../models/user.model";
import UserRepository from "./user.repository";

// Create a mocking of the user model for testing
jest.mock("../../models/user.model");

describe("User Repository", () => {
  let userRepository: UserRepository;
  let testUser = {
    name: "John Doe",
    email: "john@email.com",
    password: "password123",
  };

  beforeAll(async () => {
    // Mock new User.save() to return the test user
    (User as unknown as jest.Mock).mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(testUser),
    }));
    userRepository = new UserRepository();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test("should create a new user", async () => {
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
      const result = await userRepository.create(testUser);
    } catch (error: any) {
      expect(error.message).toContain("E11000 duplicate key");
    }
  });

  test("should throw error if user data is invalid", async () => {
    // Mock User.save() to throw validation error
    (User as unknown as jest.Mock).mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(Error("User validation failed")),
    }));

    testUser.name = "";
    testUser.email = "";
    testUser.password = "";

    try {
      await userRepository.create(testUser);
    } catch (error: any) {
      expect(error.message).toContain("User validation failed");
    }
  });
});
