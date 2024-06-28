import supertest from "supertest";
import { User } from "../../models/user.model";
import UserService from "../../services/user/user.service";
import app from "../../app";
import TestAgent from "supertest/lib/agent";

describe("User Controller", () => {
  const testUser = new User({
    name: "John Doe",
    email: "john@email.com",
    password: "password123",
  });
  let request: TestAgent;

  beforeAll(() => {
    // Initialize app (including controller and routes)
    request = supertest(app);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("POST /user", () => {
    test("should respond with 200 and the newly created user", async () => {
      // Mock the user service to return the sanitized test user

      // { password, ...sanitized } = testUser.toObject();
      UserService.prototype.create = jest.fn().mockResolvedValue({
        id: testUser.id,
        name: testUser.name,
        email: testUser.email,
      });

      const response = await request.post("/api/user").send(testUser);
      expect(response.status).toEqual(200);

      // Check that correct data was returned
      expect(response.body.user.id).toEqual(testUser.id);
      expect(response.body.user.name).toEqual(testUser.name);
      expect(response.body.user.email).toEqual(testUser.email);
      expect(response.body.token).not.toBeNull();
    });

    test("should respond with 409 if user with that email already exists", async () => {
      // Mock the user service to return the duplicate key error
      UserService.prototype.create = jest
        .fn()
        .mockRejectedValue(
          new Error("E11000 duplicate key error for test.users")
        );

      const response = await request.post("/api/user").send(testUser);
      expect(response.status).toEqual(409);
    });
  });

  describe("GET /user", () => {
    test("should respond with 200 and user if given the correct email / password", async () => {
      UserService.prototype.login = jest.fn().mockResolvedValue(testUser);

      const response = await request
        .get("/api/user")
        .send({ email: testUser.email, password: "password123" });

      expect(response.status).toEqual(200);
      // Check that correct data was returned
      expect(response.body.user.id).toEqual(testUser.id);
      expect(response.body.user.name).toEqual(testUser.name);
      expect(response.body.user.email).toEqual(testUser.email);
      expect(response.body.token).not.toBeNull();
      expect(response.body.user.id).not.toBeNull();
      // expect(response.body.email).toEqual(testUser.email);
    });

    test("should respond with 400 error if password is incorrect", async () => {
      UserService.prototype.login = jest
        .fn()
        .mockRejectedValue(Error("Incorrect password"));

      const response = await request
        .get("/api/user")
        .send({ email: testUser.email, password: "wrongpassword" });

      expect(response.status).toEqual(400);
      expect(response.body.error).toEqual("Incorrect password");
    });

    test("should respond with 400 error if email is incorrect", async () => {
      UserService.prototype.login = jest
        .fn()
        .mockRejectedValue(Error("User does not exist"));

      const response = await request
        .get("/api/user")
        .send({ email: "wrongemail", password: "password123" });

      expect(response.status).toEqual(400);
      expect(response.body.error).toEqual("User does not exist");
    });
  });
});
