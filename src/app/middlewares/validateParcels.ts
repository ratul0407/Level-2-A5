import { NextFunction, Request, Response } from "express";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";
export const validateParcels =
  () => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sender, receiver, ...rest } = req.body;
      const senderUser = await User.findById(sender);

      if (senderUser?.role !== Role.SENDER && senderUser?.role !== Role.ADMIN) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "You are not a sender, you cannot make parcel requests"
        );
      }
      const receiverUser = await User.findById(receiver);
      if (
        receiverUser?.role !== Role.RECEIVER &&
        receiverUser?.role !== Role.ADMIN
      ) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          `${receiverUser?.name} is not a receiver, He cannot receive a parcel`
        );
      }
      if (!senderUser?.address) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Please update your address to make a parcel request"
        );
      }
      if (!senderUser?.phone) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Please add your phone number to make a parcel request"
        );
      }
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
