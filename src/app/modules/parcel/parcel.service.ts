import AppError from "../../errorHelpers/AppError";
import { IAddress } from "../user/user.interface";
import { User } from "../user/user.model";
import { IParcel, Status } from "./parcel.interface";
import { Parcel } from "./parcel.model";
import httpStatus from "http-status-codes";
const createParcel = async (payload: Partial<IParcel>, location: IAddress) => {
  const session = await Parcel.startSession();

  session.startTransaction();
  try {
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
    let deliveryDate: Date;
    if (payload.sameDivision) {
      const minDays = 4;
      const maxDays = 8;
      const randomDays =
        minDays + Math.floor(Math.random() * (maxDays - minDays + 1));
      deliveryDate = new Date(Date.now() + randomDays * 24 * 60 * 60 * 1000);
    } else {
      const minDays = 7;
      const maxDays = 14;
      const randomDays =
        minDays + Math.floor(Math.random() * (maxDays - minDays + 1));
      deliveryDate = new Date(Date.now() + randomDays * 24 * 60 * 60 * 1000);
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
      estimatedDeliveryDate: deliveryDate,
      cost: amount,
    };
    console.log(parcelData);
    const createdParcel = await Parcel.create([parcelData], { session });

    await User.findByIdAndUpdate(
      parcelData.sender,
      {
        $push: { parcels: createdParcel[0]._id },
      },
      { new: true, session }
    );

    await User.findByIdAndUpdate(
      parcelData.receiver,
      {
        $push: { parcels: createdParcel[0]._id },
      },
      { new: true }
    );

    await session.commitTransaction();
    return createdParcel[0];
  } catch (error) {
    console.log(error);
    session.abortTransaction();
  } finally {
    session.endSession();
  }
};

const approveParcel = async (id: string, driver: string) => {
  const isParcelExists = await Parcel.findOne({ trackingId: id });
  if (!isParcelExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "No Parcel found");
  }
  const parcel = await Parcel.findOneAndUpdate(
    { trackingId: id },
    {
      status: Status.APPROVED,
      deliveryDriver: driver,
      $push: { trackingEvents: { status: Status.APPROVED, at: Date.now() } },
    },
    { new: true, runValidators: true }
  );

  return parcel;
};
export const ParcelService = {
  createParcel,
  approveParcel,
};
