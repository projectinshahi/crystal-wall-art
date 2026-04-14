import { z } from "zod";

export const checkoutSchema = z.object({
  type: z.enum(["Home", "Work", "Other"]),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),
  address: z.string().min(5, "Address is too short"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z
    .string()
    .regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  email: z.string().email("Invalid email address"),
  paymentMethod: z.enum(["razorpay", "cod"]),
});