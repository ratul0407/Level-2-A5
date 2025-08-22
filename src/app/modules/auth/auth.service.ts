import { IUser } from "../user/user.interface";
import bcryptjs from "bcryptjs";
import { User } from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userTokens";
const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  const isUserExists = await User.findOne({ email });
  if (!isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exists");
  }
  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExists.password
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password does not match");
  }
  const { accessToken, refreshToken } = createUserTokens(isUserExists);

  return {
    accessToken,
    refreshToken,
  };
};
const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );
  return { accessToken: newAccessToken };
};
export const AuthService = {
  credentialsLogin,
  getNewAccessToken,
};
