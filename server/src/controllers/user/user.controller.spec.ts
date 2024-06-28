import supertest from "supertest";
import { User } from "../../models/user.model";
import UserService from "../../services/user/user.service";
import app from "../../app";
import TestAgent from "supertest/lib/agent";
import DbConfig from "../../configs/db.config";

describe("User Controller", () => {
  const testUser = {
    name: "John Doe",
    email: "john@email.com",
    password: "password123",
  };
  let request: TestAgent;

  beforeAll(async () => {
    await DbConfig.connect("test");
    // Initialize app (including controller and routes)
    request = supertest(app);
  });

  afterAll(async () => {
    // Delete all users from test database
    await User.deleteMany({});
    await DbConfig.disconnect();
  });

  describe("POST /user", () => {
    test("should respond with 200 and the newly created user", async () => {
      const response = await request.post("/api/user").send(testUser);
      expect(response.status).toEqual(200);
      expect(response.body.token).not.toBeNull();
    });

    test("should respond with 409 if user with that email already exists", async () => {
      const response = await request.post("/api/user").send(testUser);
      expect(response.status).toEqual(409);
    });
  });

  describe("GET /user", () => {
    test("should respond with 200 and user if given the correct email / password", async () => {
      const response = await request
        .get("/api/user")
        .send({ email: testUser.email, password: "password123" });

      expect(response.status).toEqual(200);
      expect(response.body.token).not.toBeNull();
    });

    test("should respond with 400 error if password is incorrect", async () => {
      const response = await request
        .get("/api/user")
        .send({ email: testUser.email, password: "wrongpassword" });

      expect(response.status).toEqual(400);
      expect(response.body.error).toEqual("Incorrect password");
    });

    test("should respond with 400 error if email is incorrect", async () => {
      const response = await request
        .get("/api/user")
        .send({ email: "wrongemail", password: "password123" });

      expect(response.status).toEqual(400);
      expect(response.body.error).toEqual("User does not exist");
    });
  });
});
