/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ParcelService } from "./parcel.service";
import { sendResponse } from "../../utils/sendResponse";

const createParcel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const location = req.senderInfo;
    const payload = req.body;
    const result = await ParcelService.createParcel(payload, location);
    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "parcel created successfully!",
      data: result,
    });
  }
);

const approveParcel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.tracking_id;
    const { deliveryDriver } = req.body;
    const result = await ParcelService.approveParcel(id, deliveryDriver);
    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Parcel has been approved",
      data: result,
    });
  }
);

const updateStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.tracking_id;
    const { status } = req.body;
    const result = await ParcelService.updateStatus(id, status);
    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Status Updated successfully!",
      data: result,
    });
  }
);
export const ParcelController = {
  createParcel,
  approveParcel,
  updateStatus,
};
