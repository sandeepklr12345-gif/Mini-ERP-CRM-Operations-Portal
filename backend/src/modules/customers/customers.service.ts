import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import { CreateCustomerInput, UpdateCustomerInput, AddFollowupInput } from "./customers.schema";

interface ListParams {
  page: number;
  limit: number;
  skip: number;
  search?: string;
  status?: string;
  type?: string;
}

export async function listCustomers(params: ListParams) {
  const where: Prisma.CustomerWhereInput = {
    ...(params.status ? { status: params.status as never } : {}),
    ...(params.type ? { customerType: params.type as never } : {}),
    ...(params.search
      ? {
          OR: [
            { name: { contains: params.search, mode: "insensitive" } },
            { mobile: { contains: params.search, mode: "insensitive" } },
            { businessName: { contains: params.search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [data, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip: params.skip,
      take: params.limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.customer.count({ where }),
  ]);

  return { data, total };
}

export async function getCustomerById(id: string) {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      followups: { orderBy: { followUpDate: "desc" } },
      challans: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });
  if (!customer) throw AppError.notFound("Customer not found");
  return customer;
}

export async function createCustomer(input: CreateCustomerInput, createdById: string) {
  return prisma.customer.create({
    data: {
      ...input,
      email: input.email || undefined,
      createdById,
    },
  });
}

export async function updateCustomer(id: string, input: UpdateCustomerInput) {
  await getCustomerById(id); // 404 if missing
  return prisma.customer.update({
    where: { id },
    data: { ...input, email: input.email || undefined },
  });
}

export async function addFollowup(customerId: string, input: AddFollowupInput, createdById: string) {
  await getCustomerById(customerId); // 404 if missing
  return prisma.customerFollowup.create({
    data: {
      customerId,
      followUpDate: input.followUpDate,
      note: input.note,
      createdById,
    },
  });
}
