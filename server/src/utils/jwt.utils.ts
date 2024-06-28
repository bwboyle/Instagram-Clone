import { configDotenv } from "dotenv";
import { IUser } from "../models/user.model";
import { sign, verify } from "jsonwebtoken";

// Get JWT_SECRET from .env file
configDotenv();
const secret = process.env.JWT_SECRET;

// Generates a JWT token for the given usedr
export const generateToken = (user: IUser): string => {
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  const payload = { id: user.id, email: user.email };
  return sign(payload, secret, { expiresIn: "1h" });
};

const verifyToken = async (token: string): Promise<void> => {
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  const valid = await verify(token, secret);
  console.log(valid);
};
