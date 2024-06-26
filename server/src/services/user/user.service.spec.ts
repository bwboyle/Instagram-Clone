import { User } from "../../models/user.model";
import UserRepository from "../../repositories/user/user.repository";
import UserService from "./user.service";

describe("User Service", () => {
  test("should create a new user", async () => {
    const testUser = {
      name: "John Doe",
      email: "john@email.com",
      password: "password123",
    };
    jest
      .spyOn(UserRepository.prototype, "create")
      .mockImplementationOnce(() => Promise.resolve(new User(testUser)));

    const userService = new UserService(new UserRepository(User));

    const result = await userService.create(testUser);
    expect(result.name).toEqual(testUser.name);
    expect(result.email).toEqual(result.email);
    // Password should be hashed
    expect(result.password).not.toEqual("password123");
  });
});
