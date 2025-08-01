import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { createUserTokens } from "../../utils/userTokens";
import AppError from "../../errorHelpers/AppError";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status-codes";
import { Parcel } from "../parcel/parcel.model";
const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;
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

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decoded: JwtPayload
) => {
  const isUserExists = await User.findById(userId);
  console.log(payload);
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (payload.role) {
    if (
      (payload.role === Role.DELIVERY_PERSONNEL &&
        decoded.role !== Role.ADMIN) ||
      (payload.role === Role.SENDER && decoded.role !== Role.ADMIN) ||
      (payload.role === Role.RECEIVER && decoded.role !== Role.ADMIN)
    ) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      envVars.BCRYPT_SALT_ROUND
    );
  }
  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return updatedUser;
};

const getMyParcels = async (id: string) => {
  const user = await User.findById(id);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const parcels = await Parcel.find({ _id: { $in: user!.parcels } });
  return parcels;
};
export const UserService = {
  createUser,
  updateUser,
  getMyParcels,
};
