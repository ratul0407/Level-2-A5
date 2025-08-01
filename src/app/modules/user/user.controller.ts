/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import { ITokens, setTokenCookie } from "../../utils/setTokenCookie";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await UserService.createUser(payload);
    const tokenInfo: ITokens = {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
    setTokenCookie(res, tokenInfo);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User created successfully!",
      data: result,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payload = req.body;
    const decodedToken = req.user;
    const result = await UserService.updateUser(id, payload, decodedToken);
    sendResponse(res, {
      success: true,
      message: "User updated successfully!",
      statusCode: 201,
      data: result,
    });
  }
);

const getMyParcels = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await UserService.getMyParcels(id);
    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Successfully retrieved Users parcels",
      data: result,
    });
  }
);
export const UserController = {
  createUser,
  updateUser,
  getMyParcels,
};
