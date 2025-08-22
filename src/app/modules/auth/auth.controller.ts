/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { ITokens, setTokenCookie } from "../../utils/setTokenCookie";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await AuthService.credentialsLogin(req.body);
    const tokenInfo: ITokens = {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
    setTokenCookie(res, tokenInfo);
    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Login successfully",
      data: result,
    });
  }
);

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "No refresh token received from the cookies"
      );
    }
    const tokenInfo = await AuthService.getNewAccessToken(refreshToken);
    setTokenCookie(res, tokenInfo);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Access Token created successfully!",
      data: tokenInfo,
      success: true,
    });
  }
);

const logOut = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "User logged Out successfully!",
      data: null,
      success: true,
    });
  }
);

export const AuthController = {
  credentialsLogin,
  getNewAccessToken,
  logOut,
};
