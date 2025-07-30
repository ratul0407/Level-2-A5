import AppError from "../../errorHelpers/AppError";
import { IUser, Role } from "../user/user.interface";
import { User } from "../user/user.model";
import { IParcel } from "./parcel.interface";
import httpStatus from "http-status-codes";
import { Parcel } from "./parcel.model";
const createParcel = async (payload: Partial<IParcel>) => {
  const parcel = await Parcel.create(payload);
};

export const ParcelService = {
  createParcel,
};
