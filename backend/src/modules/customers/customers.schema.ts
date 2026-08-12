import { z } from "zod";
import { CustomerStatus, CustomerType } from "@prisma/client";

const customerTypeEnum = z.nativeEnum(CustomerType);
const customerStatusEnum = z.nativeEnum(CustomerStatus);

export const createCustomerSchema = z.object({
  name: z.string().min(1, "Customer name is required"),
  mobile: z
    .string()
    .regex(/^[0-9+\-\s]{7,15}$/, "Enter a valid mobile number"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  businessName: z.string().optional(),
  gstNumber: z.string().optional(),
  customerType: customerTypeEnum,
  address: z.string().optional(),
  status: customerStatusEnum.optional().default("LEAD"),
  followUpDate: z.coerce.date().optional(),
  notes: z.string().optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export const listCustomersQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  status: customerStatusEnum.optional(),
  type: customerTypeEnum.optional(),
});

export const addFollowupSchema = z.object({
  followUpDate: z.coerce.date(),
  note: z.string().min(1, "Note is required"),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type AddFollowupInput = z.infer<typeof addFollowupSchema>;
