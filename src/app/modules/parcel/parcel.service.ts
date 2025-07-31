import { IAddress } from "../user/user.interface";
import { IParcel, Status } from "./parcel.interface";
import { Parcel } from "./parcel.model";
const createParcel = async (payload: Partial<IParcel>, location: IAddress) => {
  console.log("I was here");
  console.log(payload);
  const weight = payload.weight;
  let amount;
  if (payload.sameDivision) {
    if (weight) {
      amount = Math.ceil(60 + weight * 5);
    }
  } else {
    if (weight) {
      amount = Math.ceil(100 + weight * 7);
    }
  }
  const parcelData = {
    ...payload,
    trackingEvents: [
      {
        status: Status.REQUESTED,
        at: new Date(), // Use Date object for Mongoose
      },
    ],
    senderInfo: location,
    estimatedDeliveryDate: "984394893",
    cost: amount,
  };
  console.log(parcelData);
  const createdParcel = await Parcel.create(parcelData);

  return createdParcel;
};

export const ParcelService = {
  createParcel,
};
