import { Types } from "mongoose";
import { IAddress } from "../user/user.interface";

export enum Status {
  REQUESTED = "REQUESTED",
  APPROVED = "APPROVED",
  PICKED_UP = "PICKED_UP",
  DISPATCHED = "DISPATCHED",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  FAILED_DELIVERY = "FAILED_DELIVERY",
  RESCHEDULED = "RESCHEDULED",
}
export interface ITracking {
  status: Status;
  at: Date;
}
export interface IParcel {
  _id?: string;
  trackingId?: string;
  name: string;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  status: Status;
  trackingEvents?: ITracking[];
  senderInfo?: IAddress;
  deliveryLocation: IAddress;
  sameDivision: boolean;
  weight: number;
  estimatedDeliveryDate?: Date;
  pickUpDate?: Date;
  deliveryDate?: Date;
  deliveryDriver?: Types.ObjectId;
  cost?: number;
}
