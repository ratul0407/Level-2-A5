import { NextFunction, Request, Response } from "express";
import { Parcel } from "../modules/parcel/parcel.model";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { Status } from "../modules/parcel/parcel.interface";
export const checkParcels =
  () => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.tracking_id;
      console.log(id, "from id");
      console.log(req.body, "From body");
      const parcel = await Parcel.findOne({ trackingId: id });
      if (!parcel) {
        throw new AppError(httpStatus.BAD_REQUEST, "Parcel does not exist");
      }

      if (parcel.currentStatus === Status.RETURNED) {
        throw new AppError(
          httpStatus.CONFLICT,
          "The parcel has already been returned"
        );
      }
      if (parcel.currentStatus === Status.DELIVERED) {
        throw new AppError(httpStatus.CONFLICT, "Parcel is already delivered");
      }
      if (
        parcel.currentStatus === Status.CANCELLED &&
        req.body.status === Status.RETURNED
      ) {
        return next();
      }
      if (parcel.currentStatus === Status.CANCELLED) {
        throw new AppError(httpStatus.CONFLICT, "Parcel has been cancelled");
      }
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
