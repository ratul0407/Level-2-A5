import z from "zod";
import { Divisions, IsActive, Role } from "./user.interface";

export const createUserZod = z.object({
  name: z.string({ error: "name must be string" }),
  email: z.email({ error: "invalid email type" }),
  password: z
    .string({ error: "Password should be string" })
    .min(8, { message: "minimum 8 characters is required" })
    .max(36, { message: "maximum 36 characters are allowed" }),

  picture: z.url().optional(),
  phone: z
    .string({ error: "Phone number must be a string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),
  role: z.enum(Object.values(Role)),
  address: z
    .object({
      division: z.enum(Object.values(Divisions)),
      city: z.string({ error: "city should be string" }),
      zip: z
        .number({ error: "zip code must be in number" })
        .min(1000, { message: "zip code must be of 4 digits" })
        .max(9999, { message: "zip code cannot be larger than 4 digits" }),
      street: z.string({ error: "street should be string" }),
    })
    .optional(),
});

export const updateUserZod = z.object({
  name: z.string({ error: "name must be a string" }).optional(),
  email: z.email({ error: "email is not valid" }).optional(),
  picture: z.url({ error: "Invalid url" }).optional(),
  address: z
    .object({
      division: z.enum(Object.values(Divisions)),
      city: z.string({ error: "city should be string" }),
      zip: z
        .number({ error: "zip code must be in number" })
        .min(1000, { message: "zip code must be of 4 digits" })
        .max(9999, { message: "zip code cannot be larger than 4 digits" }),
      street: z.string({ error: "street should be string" }),
    })
    .optional(),
  phone: z
    .string({ error: "Phone number must be a string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),
  role: z.enum(Object.values(Role)).optional(),
});

export const userActivity = z.object({
  isActive: z.enum(Object.values(IsActive)),
});
