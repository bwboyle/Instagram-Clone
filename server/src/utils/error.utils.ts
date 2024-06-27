import { MongooseError } from "mongoose";

export const errorHandler = (error: Error): any => {
  if (error.message.startsWith("E11000 duplicate key error")) {
    return [409, "Item already exists"];
  }

  return [500, "Could not complete request"];
};
