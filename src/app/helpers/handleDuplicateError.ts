/* eslint-disable @typescript-eslint/no-explicit-any */
import { TGenericErrorResponse } from "../interfaces/error.types";

export const handleDuplicateError = (err: any): TGenericErrorResponse => {
  return {
    statusCode: 400,
    message: `${err.keyValue.email} already exists`,
  };
};
