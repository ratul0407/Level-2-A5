import { Status } from "../modules/parcel/parcel.interface";

export const statusTransitions: Record<Status, Status[]> = {
  [Status.REQUESTED]: [Status.APPROVED, Status.CANCELLED],
  [Status.APPROVED]: [Status.PICKED_UP, Status.CANCELLED],
  [Status.PICKED_UP]: [Status.DISPATCHED, Status.CANCELLED],
  [Status.DISPATCHED]: [Status.OUT_FOR_DELIVERY, Status.CANCELLED],
  [Status.OUT_FOR_DELIVERY]: [
    Status.DELIVERED,
    Status.FAILED_DELIVERY,
    Status.CANCELLED,
  ],
  [Status.FAILED_DELIVERY]: [
    Status.RESCHEDULED,
    Status.OUT_FOR_DELIVERY,
    Status.CANCELLED,
  ],
  [Status.RESCHEDULED]: [Status.OUT_FOR_DELIVERY, Status.CANCELLED],
  [Status.DELIVERED]: [], // Terminal state
  [Status.CANCELLED]: [], // Terminal state
};
