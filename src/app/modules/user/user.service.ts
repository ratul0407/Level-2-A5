import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { createUserTokens } from "../../utils/userTokens";
const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
  }
  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });
  const { accessToken, refreshToken } = createUserTokens(user);
  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const UserService = {
  createUser,
};
