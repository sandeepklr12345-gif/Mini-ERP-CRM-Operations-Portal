import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as endpoints from "../services/endpoints";
import { Product } from "../types";
import { DataTable } from "../components/DataTable";
import { StockStatusBadge } from "../components/Badges";

export function InventoryPage() {
  const [rows, setRows] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    endpoints
      .listProducts({ limit: "100" })
      .then((res) => setRows(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-heading">
        <div><h1>Inventory</h1><p>Current stock levels and replenishment thresholds.</p></div>
        <Link to="/inventory/movements" className="text-sm text-primary hover:underline">
          View stock movement log →
        </Link>
      </div>
      <div className="mt-4">
        <DataTable
          rows={rows}
          loading={loading}
          rowKey={(r) => r.id}
          emptyTitle="No products yet"
          emptyHint="Add products to start tracking stock."
          columns={[
            { header: "Product", render: (r) => <span className="font-medium">{r.name}</span> },
            { header: "SKU", render: (r) => <span className="font-mono text-xs">{r.sku}</span> },
            { header: "Location", render: (r) => r.warehouseLocation || "—" },
            { header: "Current stock", render: (r) => <span className="font-mono">{r.currentStock}</span> },
            { header: "Minimum", render: (r) => <span className="font-mono">{r.minimumStock}</span> },
            { header: "Status", render: (r) => <StockStatusBadge product={r} /> },
          ]}
        />
      </div>
    </div>
  );
}
