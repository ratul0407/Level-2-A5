import { JwtPayload } from "jsonwebtoken";
import { IAddress } from "../modules/user/user.interface";

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
      senderInfo: IAddress;
    }
  }
}
