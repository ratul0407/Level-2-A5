/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatsService } from "./stats.service";

const getParcelStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await StatsService.getParcelStats();
    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Parcel statistics retrieved",
      data: result,
    });
  }
);

const getUserStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await StatsService.getUserStats();
    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "User statistics retrieved",
      data: result,
    });
  }
);
export const StatsController = {
  getParcelStats,
  getUserStats,
};
