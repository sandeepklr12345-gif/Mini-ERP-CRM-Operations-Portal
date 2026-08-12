import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as endpoints from "../services/endpoints";
import { apiErrorMessage } from "../services/api";
import { Customer, Product } from "../types";
import { Button, Input, Select } from "../components/Form";

interface Line {
  productId: string;
  quantity: string;
}

export function ChallanFormPage() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [lines, setLines] = useState<Line[]>([{ productId: "", quantity: "" }]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      endpoints.listCustomers({ limit: "100" }),
      endpoints.listProducts({ limit: "100" }),
    ]).then(([c, p]) => {
      setCustomers(c.data);
      setProducts(p.data);
    });
  }, []);

  function productStock(productId: string) {
    return products.find((p) => p.id === productId)?.currentStock;
  }

  function updateLine(index: number, field: keyof Line, value: string) {
    setLines((prev) => prev.map((l, i) => (i === index ? { ...l, [field]: value } : l)));
  }

  function addLine() {
    setLines((prev) => [...prev, { productId: "", quantity: "" }]);
  }

  function removeLine(index: number) {
    setLines((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const validLines = lines.filter((l) => l.productId && l.quantity);
    if (!customerId) {
      setError("Select a customer");
      return;
    }
    if (validLines.length === 0) {
      setError("Add at least one product line");
      return;
    }

    setSaving(true);
    try {
      const challan = await endpoints.createChallan({
        customerId,
        items: validLines.map((l) => ({ productId: l.productId, quantity: Number(l.quantity) })),
      });
      navigate(`/challans/${challan.id}`);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="page-heading"><div><h1>New sales challan</h1><p>Saved as <span className="font-mono text-xs">DRAFT</span> — stock is only reduced when you confirm it.</p></div></div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
        <Select label="Customer" required value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
          <option value="">Select customer…</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} {c.businessName ? `— ${c.businessName}` : ""}
            </option>
          ))}
        </Select>

        <div>
          <p className="text-sm font-medium text-ink">Products</p>
          <div className="mt-2 flex flex-col gap-3">
            {lines.map((line, i) => {
              const stock = productStock(line.productId);
              const requestedTooMuch = stock !== undefined && Number(line.quantity) > stock;
              return (
                <div key={i} className="flex items-end gap-3">
                  <Select
                    label={i === 0 ? "Product" : undefined}
                    value={line.productId}
                    onChange={(e) => updateLine(i, "productId", e.target.value)}
                    className="w-64"
                  >
                    <option value="">Select product…</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.sku}) — {p.currentStock} in stock
                      </option>
                    ))}
                  </Select>
                  <Input
                    label={i === 0 ? "Quantity" : undefined}
                    type="number"
                    min="1"
                    value={line.quantity}
                    onChange={(e) => updateLine(i, "quantity", e.target.value)}
                    className="w-28"
                  />
                  {requestedTooMuch && (
                    <p className="mb-2 text-xs text-tag">Only {stock} in stock — confirmation may fail.</p>
                  )}
                  {lines.length > 1 && (
                    <Button type="button" variant="ghost" onClick={() => removeLine(i)} className="mb-1">
                      Remove
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
          <Button type="button" variant="secondary" onClick={addLine} className="mt-3">
            + Add product line
          </Button>
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save as draft"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
