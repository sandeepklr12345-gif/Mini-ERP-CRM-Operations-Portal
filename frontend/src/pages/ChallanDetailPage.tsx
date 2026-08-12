import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as endpoints from "../services/endpoints";
import { apiErrorMessage } from "../services/api";
import { Challan, Customer } from "../types";
import { Button } from "../components/Form";
import { ChallanStatusBadge } from "../components/Badges";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export function ChallanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { showToast } = useToast();
  const canAct = user?.role === "ADMIN" || user?.role === "SALES";

  const [challan, setChallan] = useState<Challan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<"confirm" | "cancel" | null>(null);

  function reload() {
    if (!id) return;
    endpoints.getChallan(id).then(setChallan).finally(() => setLoading(false));
  }

  useEffect(reload, [id]);

  async function handleConfirm() {
    if (!id) return;
    setBusy(true);
    setError(null);
    try {
      await endpoints.confirmChallan(id);
      showToast("Challan confirmed — stock updated", "success");
      setConfirmDialog(null);
      reload();
    } catch (err) {
      setError(apiErrorMessage(err));
      setConfirmDialog(null);
    } finally {
      setBusy(false);
    }
  }

  async function handleCancel() {
    if (!id) return;
    setBusy(true);
    setError(null);
    try {
      await endpoints.cancelChallan(id);
      showToast("Challan cancelled", "success");
      setConfirmDialog(null);
      reload();
    } catch (err) {
      setError(apiErrorMessage(err));
      setConfirmDialog(null);
    } finally {
      setBusy(false);
    }
  }

  if (loading || !challan) return <p className="text-muted">Loading…</p>;

  const customer = challan.customer as Customer | undefined;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-xl font-semibold text-ink">{challan.challanNumber}</h1>
          <div className="mt-1">
            <ChallanStatusBadge status={challan.status} />
          </div>
        </div>
        {canAct && challan.status === "DRAFT" && (
          <div className="flex gap-2">
            <Button variant="danger" onClick={() => setConfirmDialog("cancel")}>
              Cancel challan
            </Button>
            <Button onClick={() => setConfirmDialog("confirm")}>Confirm challan</Button>
          </div>
        )}
        {canAct && challan.status === "CONFIRMED" && (
          <Button variant="danger" onClick={() => setConfirmDialog("cancel")}>
            Cancel challan
          </Button>
        )}
      </div>

      {error && <p className="mt-3 text-sm text-danger">{error}</p>}

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Customer</p>
          <p className="mt-1 font-medium">{customer?.name ?? "—"}</p>
          <p className="text-sm text-muted">{customer?.businessName}</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Created</p>
          <p className="mt-1 font-medium">{new Date(challan.createdAt).toLocaleString()}</p>
          <p className="text-sm text-muted">Total quantity: {challan.totalQuantity}</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-paper">
            <tr>
              <th className="px-4 py-3 font-medium text-muted">Product</th>
              <th className="px-4 py-3 font-medium text-muted">SKU</th>
              <th className="px-4 py-3 font-medium text-muted">Unit price</th>
              <th className="px-4 py-3 font-medium text-muted">Qty</th>
              <th className="px-4 py-3 text-right font-medium text-muted">Line total</th>
            </tr>
          </thead>
          <tbody>
            {(challan.items ?? []).map((item) => (
              <tr key={item.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">{item.productNameSnapshot}</td>
                <td className="px-4 py-3 font-mono text-xs">{item.skuSnapshot}</td>
                <td className="px-4 py-3 font-mono">₹{Number(item.unitPriceSnapshot).toLocaleString()}</td>
                <td className="px-4 py-3 font-mono">{item.quantity}</td>
                <td className="px-4 py-3 text-right font-mono">₹{Number(item.lineTotal).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmDialog && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            {confirmDialog === "confirm" ? (
              <>
                <h2 className="font-semibold text-ink">Confirm this challan?</h2>
                <p className="mt-2 text-sm text-muted">
                  Stock will be reduced for every line item and cannot be undone automatically. If any product no
                  longer has enough stock, confirmation will fail and nothing will change.
                </p>
              </>
            ) : (
              <>
                <h2 className="font-semibold text-ink">Cancel this challan?</h2>
                <p className="mt-2 text-sm text-muted">
                  {challan.status === "CONFIRMED"
                    ? "This challan is confirmed — cancelling will restore the stock that was deducted."
                    : "This draft will be marked cancelled. No stock will be affected."}
                </p>
              </>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setConfirmDialog(null)} disabled={busy}>
                Go back
              </Button>
              <Button
                variant={confirmDialog === "cancel" ? "danger" : "primary"}
                onClick={confirmDialog === "confirm" ? handleConfirm : handleCancel}
                disabled={busy}
              >
                {busy ? "Working…" : confirmDialog === "confirm" ? "Yes, confirm" : "Yes, cancel"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
