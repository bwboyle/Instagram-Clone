import { compare, hash } from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await hash(password, saltRounds);
};

export const validPassword = async (
  hashedPassword: string,
  password: string
): Promise<boolean> => {
  return await compare(password, hashedPassword);
};
