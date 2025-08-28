import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";

import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes";
import { IsActive } from "../modules/user/user.interface";
import { verifyToken } from "../utils/jwt";
export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;
    try {
      if (!accessToken) {
        throw new AppError(403, "jwt expired");
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isUserExists = await User.findOne({
        email: verifiedToken.email,
      });

      if (!isUserExists) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
      }
      if (
        isUserExists?.isActive === IsActive.BLOCKED ||
        isUserExists?.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is blocked");
      }

      if (isUserExists.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
      }

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not permitted to view this route!");
      }
      req.user = verifiedToken;

      next();
    } catch (error) {
      next(error);
    }
  };
