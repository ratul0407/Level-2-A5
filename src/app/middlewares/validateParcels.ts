/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";
export const validateParcels =
  () => async (req: Request, res: Response, next: NextFunction) => {
    console.log(req?.user, "from validate parcels");
    const isUserExists = await User.findById(req.user?.userId);

    try {
      console.log(req.body);
      const { receiver } = req.body;
      console.log(receiver);
      const receiverUser = await User.findOne({ email: receiver });
      console.log(receiverUser, "result");
      console.log("I was here");
      if (!receiverUser) {
        throw new AppError(401, "Receiver does not exist");
      }

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
      // const receiverUser = await User.findById(receiver);
      if (
        receiverUser?.role !== Role.RECEIVER &&
        receiverUser?.role !== Role.ADMIN
      ) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          `User with this email is not a receiver, He cannot receive a parcel`
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
