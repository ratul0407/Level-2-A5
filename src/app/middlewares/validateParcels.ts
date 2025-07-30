import { NextFunction, Request, Response } from "express";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";
export const validateParcels =
  () => async (req: Request, res: Response, next: NextFunction) => {
    const { sender, receiver, ...rest } = req.body;
    const senderUser = User.findById(sender);
    if (senderUser.role !== Role.SENDER) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You are not a sender, you cannot make parcel requests"
      );
    }
    const receiverUser = User.findById(receiver);
    if (receiverUser.role !== Role.RECEIVER) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `${receiverUser.name} is not a receiver, He cannot access parcel requires`
      );
    }
  };
