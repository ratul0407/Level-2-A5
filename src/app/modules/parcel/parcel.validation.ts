import z from "zod";
import { Divisions } from "../user/user.interface";
import { Status } from "./parcel.interface";

export const createParcelZod = z.object({
  name: z.string({ error: "Name must be a string" }),
  trackingId: z.string().optional(),
  sender: z.string({ error: "sender property must be a string" }),
  receiver: z.string({ error: "receiver must be a string property" }),
  deliveryLocation: z.object({
    division: z.enum(Divisions),
    city: z.string(),
    zip: z.number(),
    street: z.string(),
  }),
  sameDivision: z.boolean(),
  weight: z.number(),
});

export const parcelStatusZod = z.object({
  status: z.enum(Object.values(Status)),
});
