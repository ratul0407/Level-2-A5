import { Types } from "mongoose";

export enum Role {
  SENDER = "SENDER",
  RECEIVER = "RECEIVER",
  ADMIN = "ADMIN",
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}
export enum Divisions {
  DHAKA = "DHAKA",
  CHITTAGONG = "CHITTAGONG",
  KHULNA = "KHULNA",
  RAJSHAHI = "RAJSHAHI",
  BARISAL = "BARISAL",
  SHYLET = "SHYLET",
  RANGPUR = "RANGPUR",
  MYMENSINGH = "MYMENSINGH",
}
export interface IAddress {
  division: Divisions;
  city: string;
  zip: number;
  street: string;
}

export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}
export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  auths: IAuthProvider[];
  picture?: string;
  phone?: string;
  address?: IAddress;
  role: Role;
  isActive?: IsActive;
  isDeleted?: boolean;
  isVerified?: boolean;
  parcels?: Types.ObjectId[];
}
