import { z } from "zod";

export const createVendorSchema = z.object({
  name: z
    .string()
    .min(3, "Vendor name must be at least 3 characters")
    .max(100, "Vendor name must not exceed 100 characters"),
  contactEmail: z
    .string()
    .email("Invalid email address"),
  contactPhone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits"),
  address: z.object({
    street: z
      .string()
      .min(5, "Street address must be at least 5 characters")
      .optional()
      .or(z.literal("")),
    city: z
      .string()
      .min(2, "City must be at least 2 characters")
      .optional()
      .or(z.literal("")),
    state: z
      .string()
      .min(2, "State must be at least 2 characters")
      .optional()
      .or(z.literal("")),
    zipCode: z
      .string()
      .regex(/^\d{5,6}$/, "Invalid zip code format")
      .optional()
      .or(z.literal("")),
    country: z
      .string()
      .min(2, "Country must be at least 2 characters")
      .optional()
      .or(z.literal("")),
  }).optional(),
});

/**
 * @typedef {z.infer<typeof createVendorSchema>} CreateVendorInput
 */
