import { IAddress } from "../user/user.interface";
import { IParcel, Status } from "./parcel.interface";
import { Parcel } from "./parcel.model";
const createParcel = async (payload: Partial<IParcel>, location: IAddress) => {
  const weight = payload.weight;
  let amount;
  if (payload.sameDivision) {
    if (weight) {
      amount = Math.ceil(60 + weight * 5);
    }
  }
  if (weight) {
    amount = Math.ceil(100 + weight * 7);
  }
  const parcel = {
    payload,
    trackingEvents: [
      {
        status: Status.REQUESTED,
        at: Date.now(),
      },
    ],
    senderInfo: location,
    estimatedDeliveryDate: Date.now(),
    cost: amount,
  };
  const createdParcel = await Parcel.create(parcel);

  return createdParcel;
};

export const ParcelService = {
  createParcel,
};
