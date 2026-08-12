export type Role = "ADMIN" | "SALES" | "WAREHOUSE" | "ACCOUNTS";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export type CustomerType = "RETAIL" | "WHOLESALE" | "DISTRIBUTOR";
export type CustomerStatus = "LEAD" | "ACTIVE" | "INACTIVE";

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email?: string | null;
  businessName?: string | null;
  gstNumber?: string | null;
  customerType: CustomerType;
  address?: string | null;
  status: CustomerStatus;
  followUpDate?: string | null;
  notes?: string | null;
  createdAt: string;
  followups?: CustomerFollowup[];
  challans?: Challan[];
}

export interface CustomerFollowup {
  id: string;
  customerId: string;
  followUpDate: string;
  note: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category?: string | null;
  unitPrice: string;
  currentStock: number;
  minimumStock: number;
  warehouseLocation?: string | null;
  createdAt: string;
}

export type MovementType = "IN" | "OUT";

export interface StockMovement {
  id: string;
  productId: string;
  quantity: number;
  movementType: MovementType;
  reason: string;
  createdAt: string;
  product?: { name: string; sku: string };
}

export type ChallanStatus = "DRAFT" | "CONFIRMED" | "CANCELLED";

export interface ChallanItem {
  id: string;
  productId: string;
  productNameSnapshot: string;
  skuSnapshot: string;
  unitPriceSnapshot: string;
  quantity: number;
  lineTotal: string;
}

export interface Challan {
  id: string;
  challanNumber: string;
  customerId: string;
  customer?: Customer | { name: string; businessName?: string | null };
  status: ChallanStatus;
  totalQuantity: number;
  createdAt: string;
  items: ChallanItem[];
}

export interface Paginated<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DashboardStats {
  totalCustomers: number;
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  draftChallans: number;
  confirmedChallans: number;
  recentChallans: Challan[];
}
