// ─────────────────────────────────────────────
// AUTH & USER
// ─────────────────────────────────────────────

export type UserRole = "ADMIN" | "SALES" | "WAREHOUSE" | "ACCOUNTS";
export type Role = UserRole;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// ─────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────

export type ChallanStatus = "DRAFT" | "CONFIRMED" | "CANCELLED";
export type CustomerStatus = "ACTIVE" | "INACTIVE";
export type CustomerType = "RETAIL" | "DISTRIBUTOR" | "WHOLESALE";
export type MovementType = "IN" | "OUT";

// ─────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────

export interface RecentChallan {
  id: string;
  challanNumber: string;
  status: ChallanStatus;
  customer?: { name: string };
  createdAt: string;
}

export interface DashboardStats {
  totalCustomers: number;
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  draftChallans: number;
  confirmedChallans: number;
  recentChallans: RecentChallan[];
}

// ─────────────────────────────────────────────
// CUSTOMERS
// ─────────────────────────────────────────────

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  businessName?: string;
  gstNumber?: string;
  customerType: CustomerType;
  address?: string;
  status: CustomerStatus;
  followUpDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFollowup {
  id: string;
  customerId: string;
  followUpDate: string;
  note: string;
  createdAt: string;
}

export interface CustomerDetail extends Customer {
  followups: CustomerFollowup[];
  challans: Challan[];
}

export interface CreateCustomerInput {
  name: string;
  mobile: string;
  email?: string;
  businessName?: string;
  gstNumber?: string;
  customerType: CustomerType;
  address?: string;
  status?: CustomerStatus;
}

export interface UpdateCustomerInput {
  name?: string;
  mobile?: string;
  email?: string;
  businessName?: string;
  gstNumber?: string;
  customerType?: CustomerType;
  address?: string;
  status?: CustomerStatus;
  followUpDate?: string;
  notes?: string;
}

export interface AddFollowupInput {
  followUpDate: string;
  note: string;
}

export interface ListCustomersResponse {
  data: Customer[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ─────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  sku: string;
  category?: string;
  unitPrice: string | number; // Decimal from DB
  currentStock: number;
  minimumStock: number;
  warehouseLocation?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  sku: string;
  category?: string;
  unitPrice: number;
  currentStock?: number;
  minimumStock?: number;
  warehouseLocation?: string;
}

export interface UpdateProductInput {
  name?: string;
  category?: string;
  unitPrice?: number;
  currentStock?: number;
  minimumStock?: number;
  warehouseLocation?: string;
}

export interface ListProductsResponse {
  data: Product[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ─────────────────────────────────────────────
// INVENTORY
// ─────────────────────────────────────────────

export interface StockMovement {
  id: string;
  productId: string;
  quantity: number;
  movementType: MovementType;
  reason: string;
  createdAt: string;
  product?: {
    name: string;
    sku: string;
  };
}

export interface CreateMovementInput {
  productId: string;
  quantity: number;
  movementType: MovementType;
  reason: string;
}

export interface ListMovementsResponse {
  data: StockMovement[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ─────────────────────────────────────────────
// CHALLANS
// ─────────────────────────────────────────────

export interface ChallanItem {
  id: string;
  challanId: string;
  productId: string;
  productNameSnapshot: string;
  skuSnapshot: string;
  unitPriceSnapshot: string | number;
  quantity: number;
  lineTotal: string | number;
}

export interface Challan {
  id: string;
  challanNumber: string;
  customerId: string;
  status: ChallanStatus;
  totalQuantity: number;
  createdAt: string;
  updatedAt: string;
  customer?: Partial<Customer>;
  items?: ChallanItem[];
}

export interface ChallanDetail extends Challan {
  items: ChallanItem[];
  customer: Customer;
  createdBy?: {
    name: string;
    email: string;
  };
}

export interface CreateChallanInput {
  customerId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface UpdateChallanInput {
  customerId?: string;
  items?: {
    productId: string;
    quantity: number;
  }[];
}

export interface ListChallansResponse {
  data: Challan[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ─────────────────────────────────────────────
// API RESPONSE TYPES
// ─────────────────────────────────────────────

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errorCode?: string;
  details?: { field: string; message: string }[];
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ─────────────────────────────────────────────
// PAGINATION
// ─────────────────────────────────────────────

export interface PaginationParams {
  page?: number;
  limit?: number;
}
