import z from "zod";
import { Divisions } from "../user/user.interface";
import { Status } from "./parcel.interface";

export const createParcelZod = z.object({
  name: z.string({ error: "Name must be a string" }),
  trackingId: z.string().optional(),

  receiver: z.email({ error: "receiver must be a string property" }),
  deliveryLocation: z.object({
    division: z.enum(Divisions),
    city: z.string(),
    zip: z.number(),
    street: z.string(),
  }),
  sameDivision: z.boolean(),
  weight: z.number(),
  cost: z.number(),
  estimatedDeliveryDate: z.string(),
});

export const parcelStatusZod = z.object({
  status: z.enum([
    Status.PICKED_UP,
    Status.DISPATCHED,
    Status.OUT_FOR_DELIVERY,
    Status.DELIVERED,
    Status.FAILED_DELIVERY,
    Status.RETURNED,
  ]),
});
