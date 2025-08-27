import { Types } from "mongoose";
import { IAddress, Role } from "../user/user.interface";

export enum Status {
  REQUESTED = "REQUESTED",
  APPROVED = "APPROVED",
  PICKED_UP = "PICKED_UP",
  DISPATCHED = "DISPATCHED",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  FAILED_DELIVERY = "FAILED_DELIVERY",
  RETURNED = "RETURNED",
}
export interface ITracking {
  status: Status;
  note?: string;
  updatedBy: Role;
  at: Date;
}
export interface IParcel {
  _id?: Types.ObjectId;
  trackingId?: string;
  name: string;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  currentStatus: Status;
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
