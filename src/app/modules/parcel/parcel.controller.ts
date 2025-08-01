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

const cancelParcel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.tracking_id;
    const decodedToken = req.user;
    const { status } = req.body;
    const result = await ParcelService.cancelParcel(id, status, decodedToken);
    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Parcel cancelled successfully!",
      data: result,
    });
  }
);

const getAllParcels = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as Record<string, string>;
    const result = await ParcelService.getAllParcels(query);
    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "all parcels retrieved successfully!",
      data: result,
    });
  }
);

const confirmDelivery = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.tracking_id;
    const { delivered } = req.body;
    const result = await ParcelService.confirmDelivery(id, delivered);
    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Parcel has been delivered",
      data: result,
    });
  }
);
export const ParcelController = {
  createParcel,
  approveParcel,
  updateStatus,
  cancelParcel,
  getAllParcels,
  confirmDelivery,
};
