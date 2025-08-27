/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { statusTransitions } from "../../utils/statusTransitions";
import { IAddress, Role } from "../user/user.interface";
import { User } from "../user/user.model";
import { IParcel, Status } from "./parcel.interface";
import { Parcel } from "./parcel.model";
import httpStatus from "http-status-codes";
import { QueryBuilder } from "../../utils/queryBuilder";
import { parcelSearchableFields } from "./parcel.constant";

const createParcel = async (
  payload: Partial<IParcel>,
  location: IAddress,
  token: JwtPayload
) => {
  const session = await Parcel.startSession();
  const receiver = await User.findOne({ email: payload.receiver });

  session.startTransaction();
  try {
    const parcelData: Partial<IParcel> = {
      ...payload,
      currentStatus: Status.REQUESTED,
      sender: token?.userId,
      receiver: receiver?._id,
      trackingEvents: [
        {
          status: Status.REQUESTED,
          updatedBy: token?.role,
          at: new Date(),
          note: "Requested parcel",
        },
      ],
      senderInfo: location,
    };
    console.log(parcelData);
    const createdParcel = await Parcel.create([parcelData], { session });

    await User.findByIdAndUpdate(
      parcelData.sender,
      {
        $push: { parcels: createdParcel[0].trackingId },
      },
      { new: true, runValidators: true, session }
    );

    await User.findByIdAndUpdate(
      parcelData.receiver,
      {
        $push: { parcels: createdParcel[0].trackingId },
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

const approveParcel = async (
  id: string,
  deliveryDriver: string,
  token: JwtPayload
) => {
  const isParcelExists = await Parcel.findOne({ trackingId: id });
  if (!isParcelExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "No Parcel found");
  }

  if (isParcelExists.currentStatus === Status.APPROVED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Parcel has been already approved"
    );
  }
  const session = await Parcel.startSession();
  try {
    const driverUser = await User.findById(deliveryDriver);
    if (!driverUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "The driver does not exist");
    }
    const parcel = await Parcel.findOneAndUpdate(
      { trackingId: id },
      {
        currentStatus: Status.APPROVED,
        deliveryDriver: deliveryDriver,
        $push: {
          trackingEvents: {
            status: Status.APPROVED,
            updatedBy: token?.role,
            at: Date.now(),
            note: `Admin has assigned to ${driverUser?.name}`,
          },
        },
      },
      { new: true, runValidators: true, session }
    );

    await User.findByIdAndUpdate(
      deliveryDriver,
      {
        $push: { parcels: parcel!.trackingId },
      },
      { session }
    );
    return parcel;
  } catch (error) {
    session.abortTransaction();
    console.log(error);
  } finally {
    session.endSession();
  }
};

const updateStatus = async (
  id: string,
  newStatus: Status,
  note: string,
  token: JwtPayload
) => {
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
    console.log(allowedStatus, currentState, newStatus);
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `A parcel that is ${currentState} cannot be ${newStatus}`
    );
  }
  if (newStatus === Status.PICKED_UP) {
    const updatedParcel = await Parcel.findOneAndUpdate(
      { trackingId: id },
      {
        currentStatus: newStatus,
        pickUpDate: Date.now(),
        $push: {
          trackingEvents: {
            status: newStatus,
            updatedBy: token?.role,
            at: new Date(),
            note,
          },
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    return updatedParcel;
  } else {
    const updatedParcel = await Parcel.findOneAndUpdate(
      { trackingId: id },
      {
        currentStatus: newStatus,
        $push: {
          trackingEvents: {
            status: newStatus,
            updatedBy: token?.role,
            at: new Date(),
            note,
          },
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    return updatedParcel;
  }
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

  if (
    decodedToken.role === Role.RECEIVER ||
    decodedToken.role === Role.SENDER
  ) {
    if (
      parcel?.trackingEvents?.some(
        (event) => event.status === Status.DISPATCHED
      )
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You cannot cancel your parcel now it is already dispatched"
      );
    }
  }
  const updatedParcel = await Parcel.findOneAndUpdate(
    { trackingId: id },
    {
      currentStatus: cancelStatus,
      $push: {
        trackingEvents: {
          status: cancelStatus,
          updatedBy: decodedToken?.role,
          at: new Date(),
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

const getAllParcels = async (query: Record<string, string>) => {
  const allParcels = Parcel.find()
    .populate({ path: "sender", select: "email" })
    .populate({ path: "receiver", select: "email" })
    .populate({ path: "deliveryDriver", select: "email" });
  const queryBuilder = new QueryBuilder(allParcels, query);
  const parcels = await queryBuilder
    .search(parcelSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([parcels.build(), parcels.getMeta()]);
  return { meta, data };
};

const confirmDelivery = async (
  id: string,
  delivered: boolean,
  token: JwtPayload
) => {
  if (delivered) {
    const parcelExists = await Parcel.findOne({ trackingId: id });
    if (!parcelExists) {
      throw new AppError(httpStatus.BAD_REQUEST, "Parcel does not exist");
    }
    const updatedParcel = await Parcel.findOneAndUpdate(
      { trackingId: id },
      {
        currentStatus: Status.DELIVERED,
        deliveryDate: Date.now(),
        $push: {
          trackingEvents: {
            status: Status.DELIVERED,
            updatedBy: token?.role,
            at: new Date(),
          },
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    return updatedParcel;
  } else {
    const updatedParcel = await Parcel.findOneAndUpdate(
      { trackingId: id },
      {
        currentStatus: Status.FAILED_DELIVERY,
        $push: {
          trackingEvents: {
            status: Status.FAILED_DELIVERY,
            updatedBy: token?.role,
            at: Date.now(),
          },
        },
      },
      { new: true, runValidators: true }
    );
    return updatedParcel;
  }
};

const getParcelByTrackingId = async (id: string, token: JwtPayload) => {
  const { role, userId } = token;
  const parcel = await Parcel.findOne({ trackingId: id });

  if (!parcel) {
    throw new AppError(httpStatus.BAD_REQUEST, "Parcel does not exist");
  }

  if (role === Role.ADMIN || role === Role.SUPER_ADMIN) {
    return parcel;
  }
  if (
    parcel.sender.toString() === userId ||
    parcel.receiver.toString() === userId ||
    parcel.deliveryDriver?.toString() === userId
  ) {
    console.log("I was here");
    return parcel;
  } else {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized too see this parcel"
    );
  }
};

const getMyParcels = async (id: string, query: Record<string, string>) => {
  const user = await User.findById(id);
  const allParcels = Parcel.find({ trackingId: { $in: user!.parcels } })
    .populate({ path: "sender", select: "email" })
    .populate({ path: "receiver", select: "email" })
    .populate({ path: "deliveryDriver", select: "email" });
  const queryBuilder = new QueryBuilder(allParcels, query);
  const parcels = await queryBuilder
    .search(parcelSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([parcels.build(), parcels.getMeta()]);
  return { meta, data };
};

export const ParcelService = {
  createParcel,
  approveParcel,
  updateStatus,
  cancelParcel,
  getAllParcels,
  confirmDelivery,
  getParcelByTrackingId,
  getMyParcels,
};
