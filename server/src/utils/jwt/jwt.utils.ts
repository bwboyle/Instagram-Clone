import { configDotenv } from "dotenv";
import { IUser } from "../../models/user.model";
import { sign, verify } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../error/error.utils";

// Get JWT_SECRET from .env file
configDotenv();
const secret = process.env.JWT_SECRET;

/**
 * Generates a JWT token for the provided user
 *
 *
 * @param user - the user the token is generated for
 *
 * @returns the signed JWT token
 * @throws error if JWT_SECRET is not defined
 */
export const generateToken = (user: IUser): string => {
  if (!secret) {
    throw new Error("Could not generate token");
  }
  const payload = { id: user.id, email: user.email };
  return sign(payload, secret, { expiresIn: "1h" });
};

/**
 * Authenticates the request by verifying JWT in the header
 *
 *
 * @param req - the request to authenticate
 * @param next - the function to call if the token is verified (should be controller method)
 *
 * @returns response 401 if no token is provided, response 403 if token is invalid.
 *          calls next() after attaching valid user to request
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!secret) {
    throw new Error("Could not authenticate user");
  }

  // Get the token from the auth header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (token === undefined) {
    return errorHandler(res, new Error("No token provided"));
  }

  // Verify the token
  verify(token, secret, (err, user) => {
    if (err) {
      return errorHandler(res, new Error("Invalid token"));
    }

    // Attach user to the request
    req.body.user = user;
    next();
  });
};
