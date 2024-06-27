import { FilterQuery, Model, MongooseError } from "mongoose";
import { IUser, User } from "../../models/user.model";
import { IRepository } from "../repository.interface";
import Repository from "../repository";

export default class UserRepository extends Repository<IUser> {}
