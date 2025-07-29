import { model, Schema } from "mongoose";
import {
  Divisions,
  IAddress,
  IAuthProvider,
  IsActive,
  IUser,
  Role,
} from "./user.interface";

const authProviderScheme = new Schema<IAuthProvider>({
  provider: {
    type: String,
    required: true,
  },
  providerId: {
    type: String,
    required: true,
  },
});
const addressSchema = new Schema<IAddress>({
  division: {
    type: String,
    enum: Object.values(Divisions),
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  zip: {
    type: Number,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
});
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
    },
    address: addressSchema,
    Role: {
      type: String,
      enum: Object.values(Role),
      required: true,
    },
    isDeleted: {
      type: String,
    },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    auths: [authProviderScheme],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<IUser>("User", userSchema);
