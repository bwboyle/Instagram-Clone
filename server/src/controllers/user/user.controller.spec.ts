import supertest from "supertest";
import { IUser, User } from "../../models/user.model";
import app from "../../app";
import TestAgent from "supertest/lib/agent";
import DbConfig from "../../configs/db.config";

describe("User Controller", () => {
  let testUser: any;
  let request: TestAgent;
  let token: string;
  const url = "/api/user";

  beforeAll(async () => {
    // Connect to test db
    await DbConfig.connect("test");

    // Initialize app (including controller and routes)
    request = supertest(app);
  });

  beforeEach(() => {
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
      const response = await request.post(url).send(testUser);
      expect(response.status).toEqual(200);
      expect(response.body.token).not.toBeNull();
    });

    test("should respond with 400 if user with that email already exists", async () => {
      const response = await request.post(url).send(testUser);
      expect(response.status).toEqual(400);
      expect(response.body.error).toEqual("Email already in use");
    });
  });

  /* Login Tests */
  describe("GET /user", () => {
    test("should respond with 200 and user if given the correct email / password", async () => {
      const response = await request
        .get(url)
        .send({ email: testUser.email, password: "password123" });

      // Save the jwt token for future use in other test cases
      token = response.body.token;

      expect(response.status).toEqual(200);
      expect(token).not.toBeNull();
    });

    test("should respond with 400 error if password is incorrect", async () => {
      const response = await request
        .get(url)
        .send({ email: testUser.email, password: "wrongpassword" });

      expect(response.status).toEqual(400);
      expect(response.body.error).toEqual("Incorrect password");
    });

    test("should respond with 400 error if email is incorrect", async () => {
      const response = await request
        .get(url)
        .send({ email: "invalidemail", password: testUser.password });

      expect(response.status).toEqual(400);
      expect(response.body.error).toEqual("Incorrect email");
    });
  });

  /* Search test */
  // describe("POST user/search", () => {
  //   const url = "/api/user/find";

  //   test("should fail if request is unauthenticated", async () => {
  //     // JWT should be present in the header
  //     let response = await request.post(url);

  //     expect(response.status).toEqual(401);
  //     expect(response.body).toEqual({ error: "No token provided" });

  //     // JWT should be valid
  //     response = await request.post(url).set("authorization", "Bearer invalid");
  //     // .set("Authorization", "invalid");

  //     expect(response.status).toEqual(403);
  //     expect(response.body).toEqual({ error: "Invalid token" });
  //   });

  //   test("should respond with list of users matching filter", async () => {
  //     // Create 3 users with the same name
  //     for (let i = 1; i < 4; i++) {
  //       testUser.name = `John ${i}`;
  //       testUser.email = `John ${i}`;
  //       await request.post(url).send(testUser);
  //     }

  //     const response = await request
  //       .post(url)
  //       .set("authorization", `Bearer ${token}`)
  //       .send({ name: "John" });
  //   });
  // });
});
