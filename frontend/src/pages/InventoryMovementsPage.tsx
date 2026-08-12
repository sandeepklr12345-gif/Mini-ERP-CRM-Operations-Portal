import { FormEvent, useEffect, useState } from "react";
import * as endpoints from "../services/endpoints";
import { apiErrorMessage } from "../services/api";
import { MovementType, Product, StockMovement } from "../types";
import { DataTable } from "../components/DataTable";
import { Button, Input, Select } from "../components/Form";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export function InventoryMovementsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const canAdjust = user?.role === "ADMIN" || user?.role === "WAREHOUSE";

  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [movementType, setMovementType] = useState<MovementType>("IN");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function reload() {
    setLoading(true);
    Promise.all([
      endpoints.listMovements({ limit: "50" }),
      endpoints.listProducts({ limit: "100" }),
    ])
      .then(([m, p]) => {
        setMovements(m.data);
        setProducts(p.data);
      })
      .finally(() => setLoading(false));
  }

  useEffect(reload, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await endpoints.createMovement({
        productId,
        quantity: Number(quantity),
        movementType,
        reason,
      });
      setProductId("");
      setQuantity("");
      setReason("");
      showToast("Stock movement recorded", "success");
      reload();
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="page-heading"><div><h1>Stock movement log</h1><p>Every stock change, in or out, with who made it and why.</p></div></div>

      {canAdjust && (
        <form
          onSubmit={handleSubmit}
          className="mt-5 flex flex-wrap items-end gap-3 rounded-lg border border-border bg-white p-4"
        >
          <Select label="Product" required value={productId} onChange={(e) => setProductId(e.target.value)} className="w-56">
            <option value="">Select product…</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.sku})
              </option>
            ))}
          </Select>
          <Select
            label="Type"
            required
            value={movementType}
            onChange={(e) => setMovementType(e.target.value as MovementType)}
            className="w-28"
          >
            <option value="IN">IN</option>
            <option value="OUT">OUT</option>
          </Select>
          <Input
            label="Quantity"
            type="number"
            min="1"
            required
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-28"
          />
          <Input
            label="Reason"
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. New stock received"
            className="w-64"
          />
          <Button type="submit" disabled={saving}>
            {saving ? "Recording…" : "Record movement"}
          </Button>
        </form>
      )}
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}

      <div className="mt-5">
        <DataTable
          rows={movements}
          loading={loading}
          rowKey={(r) => r.id}
          emptyTitle="No stock movements yet"
          emptyHint="Movements appear here from manual adjustments and confirmed challans."
          columns={[
            { header: "Product", render: (r) => r.product?.name || r.productId },
            { header: "SKU", render: (r) => <span className="font-mono text-xs">{r.product?.sku}</span> },
            {
              header: "Type",
              render: (r) => (
                <span className={r.movementType === "IN" ? "text-success" : "text-danger"}>{r.movementType}</span>
              ),
            },
            { header: "Quantity", render: (r) => <span className="font-mono">{r.quantity}</span> },
            { header: "Reason", render: (r) => r.reason },
            { header: "Date", render: (r) => new Date(r.createdAt).toLocaleString() },
          ]}
        />
      </div>
    </div>
  );
}
