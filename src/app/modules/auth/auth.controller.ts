import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { ITokens, setTokenCookie } from "../../utils/setTokenCookie";

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

export const AuthController = {
  credentialsLogin,
};
