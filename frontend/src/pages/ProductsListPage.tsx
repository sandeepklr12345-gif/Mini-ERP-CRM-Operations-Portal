import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as endpoints from "../services/endpoints";
import { Product } from "../types";
import { DataTable } from "../components/DataTable";
import { Pagination } from "../components/Pagination";
import { Button, Input, Select } from "../components/Form";
import { StockStatusBadge } from "../components/Badges";
import { useAuth } from "../context/AuthContext";

export function ProductsListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const canManage = user?.role === "ADMIN" || user?.role === "WAREHOUSE";

  const [rows, setRows] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [stockStatus, setStockStatus] = useState("");

  useEffect(() => {
    setLoading(true);
    endpoints
      .listProducts({
        page: String(page),
        limit: "10",
        search: search || undefined,
        stockStatus: stockStatus || undefined,
      })
      .then((res) => {
        setRows(res.data);
        setTotalPages(res.totalPages);
      })
      .finally(() => setLoading(false));
  }, [page, search, stockStatus]);

  return (
    <div>
      <div className="page-heading">
        <div><h1>Products</h1><p>Maintain your catalogue and monitor stock health.</p></div>
        {canManage && <Button onClick={() => navigate("/products/new")}>Add product</Button>}
      </div>

      <div className="mt-4 flex gap-3">
        <Input
          placeholder="Search name or SKU…"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="w-72"
        />
        <Select
          value={stockStatus}
          onChange={(e) => {
            setPage(1);
            setStockStatus(e.target.value);
          }}
          className="w-48"
        >
          <option value="">All stock levels</option>
          <option value="IN_STOCK">In stock</option>
          <option value="LOW_STOCK">Low stock</option>
          <option value="OUT_OF_STOCK">Out of stock</option>
        </Select>
      </div>

      <div className="mt-4">
        <DataTable
          rows={rows}
          loading={loading}
          rowKey={(r) => r.id}
          onRowClick={canManage ? (r) => navigate(`/products/${r.id}/edit`) : undefined}
          emptyTitle="No products yet"
          emptyHint="Add your first product to start tracking inventory."
          columns={[
            { header: "Name", render: (r) => <span className="font-medium">{r.name}</span> },
            { header: "SKU", render: (r) => <span className="font-mono text-xs">{r.sku}</span> },
            { header: "Category", render: (r) => r.category || "—" },
            { header: "Price", render: (r) => <span className="font-mono">₹{Number(r.unitPrice).toLocaleString()}</span> },
            { header: "Stock", render: (r) => <span className="font-mono">{r.currentStock}</span> },
            { header: "Status", render: (r) => <StockStatusBadge product={r} /> },
          ]}
        />
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  );
}
