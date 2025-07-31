import AppError from "../../errorHelpers/AppError";
import { IAddress } from "../user/user.interface";
import { User } from "../user/user.model";
import { IParcel, Status } from "./parcel.interface";
import { Parcel } from "./parcel.model";
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
    const createdParcel = await Parcel.create([parcelData], { session });

    const senderUser = await User.findByIdAndUpdate(
      parcelData.sender,
      {
        $push: { parcels: createdParcel[0]._id },
      },
      { new: true, session }
    );
    if (!senderUser) {
      throw new AppError(400, "Sender user not found");
    }
    const receiverUser = await User.findByIdAndUpdate(
      parcelData.receiver,
      {
        $push: { parcels: createdParcel[0]._id },
      },
      { new: true }
    );
    if (!receiverUser) {
      throw new AppError(400, "Receiver not found");
    }
    await session.commitTransaction();
    return createdParcel[0];
  } catch (error) {
    console.log(error);
    session.abortTransaction();
  } finally {
    session.endSession();
  }
};

const approveParcel = async (id: string) => {
  console.log(id);
};
export const ParcelService = {
  createParcel,
  approveParcel,
};
