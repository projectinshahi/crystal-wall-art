import { z } from "zod";

export const addressSchema = z.object({
  type: z.enum(["Home", "Work", "Other"], {
    message: "Select address type",
  }),
  name: z.string().min(1, "Name is required"),
  phone: z
    .string()
    .transform((val) => (val.trim() === "" ? null : val))
    .refine((val) => !val || /^[6-9]\d{9}$/.test(val), {
      message: "Invalid phone number",
    })
    .nullable(),
  address: z.string().min(5, "Address is too short"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),
});

export type AddressFormValues = z.infer<typeof addressSchema>;