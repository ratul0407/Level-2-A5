/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";
export const validateParcels =
  () => async (req: Request, res: Response, next: NextFunction) => {
    const isUserExists = await User.findById(req.user?.userId);

    try {
      const { receiver } = req.body;

      if (
        isUserExists?.role !== Role.SENDER &&
        isUserExists?.role !== Role.ADMIN &&
        isUserExists?.role !== Role.SUPER_ADMIN
      ) {
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
      if (!isUserExists?.address) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Please update your address to make a parcel request"
        );
      }
      if (!isUserExists?.phone) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Please add your phone number to make a parcel request"
        );
      }
      const senderInfo = isUserExists.address;
      (req as any).senderInfo = senderInfo;
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
