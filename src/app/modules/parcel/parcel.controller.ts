import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ParcelService } from "./parcel.service";
import { sendResponse } from "../../utils/sendResponse";

const createParcel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ParcelService.createParcel(req.body);
    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "parcel created successfully!",
      data: result,
    });
  }
);

export const ParcelController = {
  createParcel,
};
