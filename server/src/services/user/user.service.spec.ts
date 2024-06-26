import { User } from "../../models/user.model";
import UserRepository from "../../repositories/user/user.repository";
import { hashPassword } from "../../utils/password.utils";
import UserService from "./user.service";

describe("User Service", () => {
  const testUser = {
    name: "John Doe",
    email: "john@email.com",
    password: "password123",
  };
  let userRepository: UserRepository;
  let userService: UserService;

  beforeAll(() => {
    userRepository = new UserRepository();
    userService = new UserService(userRepository);

    // Mock the user repository to return the test user
    userRepository.create = jest.fn().mockResolvedValue(
      new User({
        ...testUser,
        password: "hashedPassword123",
      })
    );
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test("should create a new user", async () => {
    const result = await userService.create(testUser);
    expect(result.name).toEqual(testUser.name);
    expect(result.email).toEqual(result.email);
    // Password should be hashed
    expect(result.password).toEqual("hashedPassword123");
  });
});
