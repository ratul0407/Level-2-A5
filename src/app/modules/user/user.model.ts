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
export const addressSchema = new Schema<IAddress>(
  {
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
  },
  { _id: false }
);
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
    },
    address: addressSchema,
    role: {
      type: String,
      enum: Object.values(Role),
      required: true,
    },
    isDeleted: {
      type: Boolean,
    },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    auths: [authProviderScheme],
    parcels: {
      type: [Schema.Types.ObjectId],
      ref: "Parcel",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<IUser>("User", userSchema);
