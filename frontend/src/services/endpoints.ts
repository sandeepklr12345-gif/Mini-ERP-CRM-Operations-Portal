/**
 * API Endpoint functions for all backend routes.
 * Uses the configured Axios client from api.ts
 */

import { api } from "./api";
import type {
  LoginResponse,
  DashboardStats,
  ListCustomersResponse,
  Customer,
  CustomerDetail,
  CreateCustomerInput,
  UpdateCustomerInput,
  AddFollowupInput,
  ListProductsResponse,
  Product,
  CreateProductInput,
  UpdateProductInput,
  ListMovementsResponse,
  CreateMovementInput,
  ListChallansResponse,
  Challan,
  ChallanDetail,
  CreateChallanInput,
  UpdateChallanInput,
} from "../types";

// ─────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<{ data: LoginResponse }>("/auth/login", { email, password });
  return data.data;
}

// ─────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────

export async function getDashboard(): Promise<DashboardStats> {
  const { data } = await api.get<{ data: DashboardStats }>("/dashboard");
  return data.data;
}

// ─────────────────────────────────────────────
// CUSTOMERS
// ─────────────────────────────────────────────

export async function listCustomers(
  pageOrParams?: number | { page?: number | string; limit?: number | string; search?: string; status?: string; type?: string },
  limit?: number | string,
  search?: string,
  status?: string,
  type?: string
): Promise<ListCustomersResponse> {
  let page = 1;
  let actualLimit = 10;

  if (typeof pageOrParams === "object" && pageOrParams !== null) {
    page = typeof pageOrParams.page === "string" ? parseInt(pageOrParams.page, 10) : pageOrParams.page ?? 1;
    actualLimit = typeof pageOrParams.limit === "string" ? parseInt(pageOrParams.limit, 10) : pageOrParams.limit ?? 10;
    search = pageOrParams.search;
    status = pageOrParams.status;
    type = pageOrParams.type;
  } else if (typeof pageOrParams === "number") {
    page = pageOrParams;
    actualLimit = typeof limit === "string" ? parseInt(limit, 10) : limit ?? 10;
  }

  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("limit", String(actualLimit));
  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (type) params.append("type", type);

  const { data } = await api.get<ListCustomersResponse>(`/customers?${params.toString()}`);
  return data;
}

export async function getCustomer(id: string): Promise<CustomerDetail> {
  const { data } = await api.get<{ data: CustomerDetail }>(`/customers/${id}`);
  return data.data;
}

export async function createCustomer(input: CreateCustomerInput): Promise<Customer> {
  const { data } = await api.post<{ data: Customer }>("/customers", input);
  return data.data;
}

export async function updateCustomer(id: string, input: UpdateCustomerInput): Promise<Customer> {
  const { data } = await api.put<{ data: Customer }>(`/customers/${id}`, input);
  return data.data;
}

export async function addCustomerFollowup(id: string, input: AddFollowupInput): Promise<{ id: string }> {
  const { data } = await api.post<{ data: { id: string } }>(`/customers/${id}/followups`, input);
  return data.data;
}

// Alias for compatibility
export const addFollowup = addCustomerFollowup;

// ─────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────

export async function listProducts(
  pageOrParams?: number | { page?: number | string; limit?: number | string; search?: string; category?: string; stockStatus?: string },
  limit?: number | string,
  search?: string,
  category?: string,
  stockStatus?: string
): Promise<ListProductsResponse> {
  let page = 1;
  let actualLimit = 10;

  if (typeof pageOrParams === "object" && pageOrParams !== null) {
    page = typeof pageOrParams.page === "string" ? parseInt(pageOrParams.page, 10) : pageOrParams.page ?? 1;
    actualLimit = typeof pageOrParams.limit === "string" ? parseInt(pageOrParams.limit, 10) : pageOrParams.limit ?? 10;
    search = pageOrParams.search;
    category = pageOrParams.category;
    stockStatus = pageOrParams.stockStatus;
  } else if (typeof pageOrParams === "number") {
    page = pageOrParams;
    actualLimit = typeof limit === "string" ? parseInt(limit, 10) : limit ?? 10;
  }

  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("limit", String(actualLimit));
  if (search) params.append("search", search);
  if (category) params.append("category", category);
  if (stockStatus) params.append("stockStatus", stockStatus);

  const { data } = await api.get<ListProductsResponse>(`/products?${params.toString()}`);
  return data;
}

export async function getProduct(id: string): Promise<Product> {
  const { data } = await api.get<{ data: Product }>(`/products/${id}`);
  return data.data;
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const { data } = await api.post<{ data: Product }>("/products", input);
  return data.data;
}

export async function updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
  const { data } = await api.put<{ data: Product }>(`/products/${id}`, input);
  return data.data;
}

// ─────────────────────────────────────────────
// INVENTORY
// ─────────────────────────────────────────────

export async function listStockMovements(
  pageOrParams?: number | { page?: number | string; limit?: number | string; productId?: string; movementType?: string; dateFrom?: string; dateTo?: string },
  limit?: number | string,
  productId?: string,
  movementType?: string,
  dateFrom?: string,
  dateTo?: string
): Promise<ListMovementsResponse> {
  let page = 1;
  let actualLimit = 10;

  if (typeof pageOrParams === "object" && pageOrParams !== null) {
    page = typeof pageOrParams.page === "string" ? parseInt(pageOrParams.page, 10) : pageOrParams.page ?? 1;
    actualLimit = typeof pageOrParams.limit === "string" ? parseInt(pageOrParams.limit, 10) : pageOrParams.limit ?? 10;
    productId = pageOrParams.productId;
    movementType = pageOrParams.movementType;
    dateFrom = pageOrParams.dateFrom;
    dateTo = pageOrParams.dateTo;
  } else if (typeof pageOrParams === "number") {
    page = pageOrParams;
    actualLimit = typeof limit === "string" ? parseInt(limit, 10) : limit ?? 10;
  }

  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("limit", String(actualLimit));
  if (productId) params.append("productId", productId);
  if (movementType) params.append("movementType", movementType);
  if (dateFrom) params.append("dateFrom", dateFrom);
  if (dateTo) params.append("dateTo", dateTo);

  const { data } = await api.get<ListMovementsResponse>(`/inventory/movements?${params.toString()}`);
  return data;
}

// Alias for compatibility with existing code
export const listMovements = listStockMovements;

export async function createStockMovement(input: CreateMovementInput): Promise<{ id: string }> {
  const { data } = await api.post<{ data: { id: string } }>("/inventory/movements", input);
  return data.data;
}

// Alias for compatibility with existing code  
export const createMovement = createStockMovement;

// ─────────────────────────────────────────────
// CHALLANS
// ─────────────────────────────────────────────

export async function listChallans(
  pageOrParams?: number | { page?: number | string; limit?: number | string; status?: string; customerId?: string; challanNumber?: string },
  limit?: number | string,
  status?: string,
  customerId?: string,
  challanNumber?: string
): Promise<ListChallansResponse> {
  let page = 1;
  let actualLimit = 10;

  if (typeof pageOrParams === "object" && pageOrParams !== null) {
    page = typeof pageOrParams.page === "string" ? parseInt(pageOrParams.page, 10) : pageOrParams.page ?? 1;
    actualLimit = typeof pageOrParams.limit === "string" ? parseInt(pageOrParams.limit, 10) : pageOrParams.limit ?? 10;
    status = pageOrParams.status;
    customerId = pageOrParams.customerId;
    challanNumber = pageOrParams.challanNumber;
  } else if (typeof pageOrParams === "number") {
    page = pageOrParams;
    actualLimit = typeof limit === "string" ? parseInt(limit, 10) : limit ?? 10;
  }

  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("limit", String(actualLimit));
  if (status) params.append("status", status);
  if (customerId) params.append("customerId", customerId);
  if (challanNumber) params.append("challanNumber", challanNumber);

  const { data } = await api.get<ListChallansResponse>(`/challans?${params.toString()}`);
  return data;
}

export async function getChallan(id: string): Promise<ChallanDetail> {
  const { data } = await api.get<{ data: ChallanDetail }>(`/challans/${id}`);
  return data.data;
}

export async function createChallan(input: CreateChallanInput): Promise<Challan> {
  const { data } = await api.post<{ data: Challan }>("/challans", input);
  return data.data;
}

export async function updateChallan(id: string, input: UpdateChallanInput): Promise<Challan> {
  const { data } = await api.put<{ data: Challan }>(`/challans/${id}`, input);
  return data.data;
}

export async function confirmChallan(id: string): Promise<Challan> {
  const { data } = await api.post<{ data: Challan }>(`/challans/${id}/confirm`);
  return data.data;
}

export async function cancelChallan(id: string): Promise<Challan> {
  const { data } = await api.post<{ data: Challan }>(`/challans/${id}/cancel`);
  return data.data;
}
