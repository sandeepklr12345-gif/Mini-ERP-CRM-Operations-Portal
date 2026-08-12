import { ChallanStatus, CustomerStatus, CustomerType, MovementType, Product } from "../types";

interface BadgeProps {
  text: string;
  variant?: "success" | "warning" | "error" | "info" | "default";
  className?: string;
}

function Badge({ text, variant = "default", className = "" }: BadgeProps) {
  const variants: Record<string, string> = {
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    default: "bg-gray-100 text-gray-800",
  };

  return (
    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${variants[variant]} ${className}`}>
      {text}
    </span>
  );
}

export function ChallanStatusBadge({ status }: { status: ChallanStatus }) {
  const config: Record<ChallanStatus, { text: string; variant: "success" | "warning" | "error" | "info" | "default" }> = {
    DRAFT: { text: "Draft", variant: "info" },
    CONFIRMED: { text: "Confirmed", variant: "success" },
    CANCELLED: { text: "Cancelled", variant: "error" },
  };
  const { text, variant } = config[status];
  return <Badge text={text} variant={variant} />;
}

export function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  const config: Record<CustomerStatus, { text: string; variant: "success" | "warning" | "error" | "info" | "default" }> = {
    ACTIVE: { text: "Active", variant: "success" },
    INACTIVE: { text: "Inactive", variant: "warning" },
  };
  const { text, variant } = config[status];
  return <Badge text={text} variant={variant} />;
}

export function CustomerTypeBadge({ type }: { type: CustomerType }) {
  const config: Record<CustomerType, { text: string; variant: "success" | "warning" | "error" | "info" | "default" }> = {
    RETAIL: { text: "Retail", variant: "info" },
    DISTRIBUTOR: { text: "Distributor", variant: "info" },
    WHOLESALE: { text: "Wholesale", variant: "warning" },
  };
  const { text, variant } = config[type];
  return <Badge text={text} variant={variant} />;
}

export function MovementTypeBadge({ type }: { type: MovementType }) {
  const config: Record<MovementType, { text: string; variant: "success" | "warning" | "error" | "info" | "default" }> = {
    IN: { text: "Stock In", variant: "success" },
    OUT: { text: "Stock Out", variant: "warning" },
  };
  const { text, variant } = config[type];
  return <Badge text={text} variant={variant} />;
}

export function StockStatusBadge({ product }: { product: Product }) {
  if (product.currentStock === 0) {
    return <Badge text="Out of Stock" variant="error" />;
  } else if (product.currentStock <= product.minimumStock) {
    return <Badge text="Low Stock" variant="warning" />;
  } else {
    return <Badge text="In Stock" variant="success" />;
  }
}

export default Badge;
