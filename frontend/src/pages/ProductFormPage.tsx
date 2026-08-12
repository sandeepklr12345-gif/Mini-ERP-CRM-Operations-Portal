import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as endpoints from "../services/endpoints";
import { apiErrorMessage } from "../services/api";
import { Button, Input } from "../components/Form";

const emptyForm = {
  name: "",
  sku: "",
  category: "",
  unitPrice: "",
  currentStock: "0",
  minimumStock: "0",
  warehouseLocation: "",
};

export function ProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    endpoints.getProduct(id).then((p) => {
      setForm({
        name: p.name,
        sku: p.sku,
        category: p.category ?? "",
        unitPrice: String(p.unitPrice),
        currentStock: String(p.currentStock),
        minimumStock: String(p.minimumStock),
        warehouseLocation: p.warehouseLocation ?? "",
      });
      setLoading(false);
    });
  }, [id]);

  function set<K extends keyof typeof emptyForm>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const payload = {
      ...form,
      unitPrice: Number(form.unitPrice),
      currentStock: Number(form.currentStock),
      minimumStock: Number(form.minimumStock),
    };
    try {
      if (isEdit && id) {
        await endpoints.updateProduct(id, payload as never);
      } else {
        await endpoints.createProduct(payload as never);
      }
      navigate("/products");
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-muted">Loading…</p>;

  return (
    <div className="max-w-xl">
      <div className="page-heading"><div><h1>{isEdit ? "Edit product" : "Add product"}</h1><p>Maintain the catalogue and set accurate stock thresholds.</p></div></div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <Input label="Product name" required value={form.name} onChange={(e) => set("name", e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="SKU / code" required value={form.sku} onChange={(e) => set("sku", e.target.value)} />
          <Input label="Category" value={form.category} onChange={(e) => set("category", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Unit price (₹)"
            type="number"
            step="0.01"
            min="0"
            required
            value={form.unitPrice}
            onChange={(e) => set("unitPrice", e.target.value)}
          />
          <Input label="Warehouse location" value={form.warehouseLocation} onChange={(e) => set("warehouseLocation", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label={isEdit ? "Current stock (adjust via Inventory instead)" : "Opening stock"}
            type="number"
            min="0"
            required
            disabled={isEdit}
            value={form.currentStock}
            onChange={(e) => set("currentStock", e.target.value)}
          />
          <Input
            label="Minimum stock alert quantity"
            type="number"
            min="0"
            required
            value={form.minimumStock}
            onChange={(e) => set("minimumStock", e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="mt-2 flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Add product"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
