import supertest from "supertest";
import { IUser, User } from "../../models/user.model";
import app from "../../app";
import TestAgent from "supertest/lib/agent";
import DbConfig from "../../configs/db.config";

describe("User Controller", () => {
  let testUser: any;
  let request: TestAgent;
  let token: string;

  beforeAll(async () => {
    // Connect to test db
    await DbConfig.connect("test");

    // Initialize app (including controller and routes)
    request = supertest(app);

    // Create test user
    testUser = {
      name: "John Doe",
      email: "john@email.com",
      password: "password123",
    };
  });

  afterAll(async () => {
    // Delete all users from test database
    await User.deleteMany({});
    await DbConfig.disconnect();
  });

  describe("POST /user", () => {
    /* Signup tests */
    test("should respond with 200 and the newly created user", async () => {
      const response = await request.post("/api/user").send(testUser);
      expect(response.status).toEqual(200);
      expect(response.body.token).not.toBeNull();
    });

    test("should respond with 400 if user with that email already exists", async () => {
      const response = await request.post("/api/user").send(testUser);
      expect(response.status).toEqual(400);
      expect(response.body.error).toEqual("Email already in use");
    });
  });

  /* Login Tests */
  describe("GET /user", () => {
    test("should respond with 200 and user if given the correct email / password", async () => {
      const response = await request
        .get("/api/user")
        .send({ email: testUser.email, password: "password123" });

      // Save the jwt token for future use in other test cases
      token = response.body.token;

      expect(response.status).toEqual(200);
      expect(token).not.toBeNull();
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
        .send({ email: "invalidemail", password: testUser.password });

      expect(response.status).toEqual(400);
      expect(response.body.error).toEqual("Incorrect email");
    });
  });

  // /* Search test */
  // describe("GET user/search", () => {
  //   test("should fail if request is unauthenticated", async () => {
  //     // JWT should be present in the header
  //     const response = await request
  //       .get("/api/user/search")
  //       .set("Authorization", "invalid");
  //   });
  // });
});
