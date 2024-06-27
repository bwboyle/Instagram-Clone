import { Response } from "express";

export const errorHandler = (res: Response, error: Error): Response => {
  // 409 error if account already exists
  if (error.message.startsWith("E11000 duplicate key error")) {
    return res.status(409).json({ error: "Item already exists" });
  }

  // 400 error if password is incorrect when logging in
  if (error.message === "Incorrect password") {
    return res.status(400).json({ error: error.message });
  }

  // 400 error if no user with that email exists
  if (error.message === "User does not exist") {
    return res.status(400).json({ error: error.message });
  }

  return res.status(500).json({ error: "Failed to complete request" });
};
