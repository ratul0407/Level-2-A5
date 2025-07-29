import { Response } from "express";

export interface ITokens {
  accessToken?: string;
  refreshToken?: string;
}
export const setTokenCookie = (res: Response, tokenInfo: ITokens) => {
  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: false,
    });
  }
  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      httpOnly: true,
      secure: false,
    });
  }
};
