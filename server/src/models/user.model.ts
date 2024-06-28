import { model, Schema, Types } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
export interface IUser {
  id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// 3. Create a Model.
export const User = model("User", userSchema);
