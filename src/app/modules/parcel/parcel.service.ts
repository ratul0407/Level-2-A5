import AppError from "../../errorHelpers/AppError";
import { IUser, Role } from "../user/user.interface";
import { User } from "../user/user.model";
import { IParcel } from "./parcel.interface";
import httpStatus from "http-status-codes";
const createParcel = async (parcel: Partial<IParcel>) => {
  const { receiver, ...rest } = parcel;
  const isReceiver = User.findById(receiver);
};

export const ParcelService = {
  createParcel,
};
