import { model, Schema } from "mongoose";
import { IParcel, ITracking, Status } from "./parcel.interface";
import { addressSchema } from "../user/user.model";
import { v4 as uuidv4 } from "uuid";
import { getFormattedDate } from "../../utils/getFormattedDate";
import { Role } from "../user/user.interface";
const trackingSchema = new Schema<ITracking>(
  {
    status: {
      type: String,
      enum: Object.values(Status),
      required: true,
    },
    updatedBy: Object.values(Role),
    at: Date,
  },
  {
    _id: false,
  }
);
const parcelSchema = new Schema<IParcel>(
  {
    name: {
      type: String,
      required: true,
    },
    trackingId: {
      type: String,
    },
    senderInfo: addressSchema,
    deliveryLocation: addressSchema,
    sameDivision: {
      type: Boolean,
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    currentStatus: {
      type: String,
      enum: Object.values(Status),
      default: Status.REQUESTED,
    },
    trackingEvents: [trackingSchema],
    weight: {
      type: Number,
      required: true,
    },
    estimatedDeliveryDate: {
      type: Date,
      required: true,
    },
    pickUpDate: {
      type: Date,
    },
    deliveryDate: {
      type: Date,
    },
    deliveryDriver: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    cost: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

parcelSchema.pre("save", async function (next) {
  const datePart = getFormattedDate(new Date());
  const uniqueId = uuidv4();
  const trackingId = `TRK-${datePart}-${uniqueId
    .replace(/-g/, "")
    .substring(0, 12)}`;
  this.trackingId = trackingId;
  next();
});
export const Parcel = model<IParcel>("Parcel", parcelSchema);
