import supertest from "supertest";
import { User } from "../../models/user.model";
import UserRepository from "../../repositories/user/user.repository";
import UserService from "../../services/user/user.service";
import { hashPassword } from "../../utils/password.utils";
import UserController from "./user.controller";
import app from "../../app";
import TestAgent from "supertest/lib/agent";

describe("User Controller", () => {
  const testUser = {
    name: "John Doe",
    email: "john@email.com",
    password: "password123",
  };
  let request: TestAgent;

  beforeAll(() => {
    // Initialize app (including controller and routes)
    request = supertest(app);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test("should respond with 200 and the newly created user", async () => {
    // Mock the user service to return the test user
    UserService.prototype.create = jest.fn().mockResolvedValue(
      new User({
        ...testUser,
        password: "hashedPassword123",
      })
    );

    const response = await request.post("/api/user").send(testUser);
    expect(response.status).toEqual(200);

    // Check that correct data was returned
    expect(response.body._id).not.toBeNull();
    expect(response.body.name).toEqual(testUser.name);
    expect(response.body.email).toEqual(testUser.email);
    expect(response.body.password).toEqual("hashedPassword123");
  });

  test("should respond with 500 and error if user was not created", async () => {
    // Mock the user service to return the test user
    UserService.prototype.create = jest.fn().mockRejectedValue(new Error());

    const response = await request.post("/api/user").send({});
    expect(response.status).toEqual(500);
    expect(response.body.error).not.toBeNull();
  });
});
