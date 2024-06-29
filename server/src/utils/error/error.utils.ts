import { Response } from "express";

export const errorMap: { [key: string]: number } = {
  "Email already in use": 400,
  "Incorrect email or password": 400,
  "Could not generate token": 500,
  "Could not verify token": 500,
  "No token provided": 401,
  "Invalid token": 403,
};

/**
 * Generates a response by finding provided error in the error map
 *
 *
 * @param res - Response object to attach status and message to
 * @param error - the Error to be returned
 *
 * @returns the correct status code along with Error message.
 *          if the error is not in the map, throw 500 server error
 */
export const errorHandler = (res: Response, error: Error): Response => {
  // Responw with error from map
  for (const key in errorMap) {
    if (error.message.startsWith(key)) {
      const status = errorMap[key];
      return res.status(status).json({ error: key });
    }
  }
  // respond with 500 server error on unexpected error
  return res.status(500).json({ error: "Failed to complete request" });
};
