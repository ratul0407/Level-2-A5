/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { statusTransitions } from "../../utils/statusTransitions";
import { IAddress, Role } from "../user/user.interface";
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

const approveParcel = async (id: string, deliveryDriver: string) => {
  const isParcelExists = await Parcel.findOne({ trackingId: id });
  if (!isParcelExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "No Parcel found");
  }
  const driverUser = await User.findById(deliveryDriver);
  if (!driverUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "The driver does not exist");
  }
  const parcel = await Parcel.findOneAndUpdate(
    { trackingId: id },
    {
      status: Status.APPROVED,
      deliveryDriver: deliveryDriver,
      $push: { trackingEvents: { status: Status.APPROVED, at: Date.now() } },
    },
    { new: true, runValidators: true }
  );

  return parcel;
};

const updateStatus = async (id: string, newStatus: Status) => {
  const parcel = await Parcel.findOne({ trackingId: id });
  if (!parcel) {
    throw new AppError(httpStatus.BAD_REQUEST, "The parcel does not exist");
  }
  const currentState =
    parcel.trackingEvents![parcel.trackingEvents!.length - 1]?.status;
  console.log(currentState);
  if (!currentState) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "No current status found for the parcel"
    );
  }
  const allowedStatus = statusTransitions[currentState];
  if (!allowedStatus.includes(newStatus)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid status transition: ${currentState} to ${newStatus}`
    );
  }
  const updatedParcel = await Parcel.findOneAndUpdate(
    { trackingId: id },
    {
      status: newStatus,
      $push: {
        trackingEvents: {
          status: newStatus,
          at: Date.now(),
        },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );
  return updatedParcel;
};

const cancelParcel = async (
  id: string,
  cancelStatus: Status,
  decodedToken: JwtPayload
) => {
  const parcel = await Parcel.findOne({ trackingId: id });

  if (!parcel) {
    throw new AppError(httpStatus.BAD_REQUEST, "Parcel does not exist");
  }

  if (decodedToken.role === Role.RECEIVER) {
    if (parcel.status === Status.OUT_FOR_DELIVERY) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You cannot cancel your parcel now"
      );
    }
  }
  if (decodedToken.role === Role.SENDER) {
    if (parcel.status === Status.DISPATCHED) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You cannot cancel your parcel now"
      );
    }
  }

  const updatedParcel = await Parcel.findOneAndUpdate(
    { trackingId: id },
    {
      status: cancelStatus,
      $push: {
        trackingEvents: {
          status: cancelStatus,
          at: Date.now(),
        },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );
  return updatedParcel;
};
export const ParcelService = {
  createParcel,
  approveParcel,
  updateStatus,
  cancelParcel,
};
