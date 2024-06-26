import DbConfig from "../../configs/db.config";
import { User } from "../../models/user.model";
import UserRepository from "./user.repository";

describe("User Repository", () => {
  let userRepository: UserRepository;
  let testUser = {
    name: "John Doe",
    email: "john@email.com",
    password: "password123",
  };

  beforeEach(async () => {
    // Mock new User.save() to return the test user
    jest
      .spyOn(User.prototype, "save")
      .mockImplementationOnce(() => Promise.resolve(new User(testUser)));

    userRepository = new UserRepository(User);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should create a new user", async () => {
    const result = await userRepository.create(testUser);
    expect(result.email).toEqual(testUser.email);
    expect(result.name).toEqual(testUser.name);
  });

  test("should thhrow error if user already exists", async () => {
    // Mock User.save() to throw duplicate key error
    jest
      .spyOn(User.prototype, "save")
      .mockImplementationOnce(() =>
        Promise.reject(new Error("E11000 duplicate key"))
      );

    // Email must be unique for each user
    try {
      const result = await userRepository.create(testUser);
    } catch (error: any) {
      expect(error.message).toContain("E11000 duplicate key");
    }
  });

  test("should throw error if user data is invalid", async () => {
    // Mock User.save() to throw validation error
    jest
      .spyOn(User.prototype, "save")
      .mockImplementationOnce(() =>
        Promise.reject(new Error("User validation failed"))
      );
    testUser.name = "";
    testUser.email = "";
    testUser.password = "";
    try {
      const result = await userRepository.create(testUser);
    } catch (error: any) {
      expect(error.message).toContain("User validation failed");
    }
  });
});
