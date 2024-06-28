import { configDotenv } from "dotenv";
import mongoose, { ConnectOptions, mongo, Mongoose } from "mongoose";
import { resolve } from "path";

configDotenv();

export default class DbConfig {
  private static connection: Mongoose;

  static async connect(dbName: string): Promise<void> {
    // Don't connect if given invalid database name
    if (!dbName || dbName.length === 0) {
      throw new Error("Invalid database name");
    }
    // Add database dbName to the mongo URI
    const mongoUri = process.env.MONGODB_URI + dbName;
    this.connection = await mongoose.connect(mongoUri);
  }

  static getDbName(): string {
    return this.connection.connections[0].db.namespace;
  }

  static async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }
}
