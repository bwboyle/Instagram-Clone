import { Types } from "mongoose";
import { IUser } from "../../models/user.model";
import { generateToken, authenticate } from "./jwt.utils";
import { NextFunction, request, Request, response, Response } from "express";

describe("JWT Middleware", () => {
  const testUser: IUser = {
    id: new Types.ObjectId(),
    name: "John Doe",
    email: "john@email.com",
    password: "password123",
  };

  let secret: string | undefined;

  beforeEach(() => {
    secret = process.env.JWT_SECRET;
  });

  describe("generateToken", () => {
    test("should throw error if no JWT secret in environment", () => {
      try {
        secret = "";
        generateToken(testUser);
      } catch (error: any) {
        expect(error.message).toEqual("JWT_SECRET is not defined");
      }
    });

    test("should generate token for valid user", () => {
      const token = generateToken(testUser);
      expect(token).not.toBeNull();
    });
  });

  describe("authenticate", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
      // Create mock request and response objects
      req = { headers: {}, body: {} };
      res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      next = jest.fn();
    });

    test("should authenticate user if token is verified", () => {
      // Add token to request header
      const token = generateToken(testUser);
      req.headers = { authorization: `Bearer ${token}` };

      authenticate(req as Request, res as Response, next);

      // Check if correctly authenticated
      expect(req.body.user.id).not.toBeNull();
      expect(req.body.user.email).toEqual(testUser.email);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    test("should respond with 401 if no token is provided", () => {
      // Call authenticate without settion auth header
      authenticate(req as Request, res as Response, next);

      // Check response
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "No token provided" });
      expect(next).not.toHaveBeenCalled();
    });

    test("should respond with 403 if token is invalid", () => {
      req.headers = { authorization: "Bearer invalid" };

      authenticate(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid token" });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
