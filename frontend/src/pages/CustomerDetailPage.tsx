import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as endpoints from "../services/endpoints";
import { apiErrorMessage } from "../services/api";
import type { CustomerDetail } from "../types";
import { Button, Input, Textarea } from "../components/Form";
import { ChallanStatusBadge, CustomerStatusBadge } from "../components/Badges";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const canManage = user?.role === "ADMIN" || user?.role === "SALES";

  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [followUpDate, setFollowUpDate] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function reload() {
    if (!id) return;
    endpoints.getCustomer(id).then(setCustomer).finally(() => setLoading(false));
  }

  useEffect(reload, [id]);

  async function handleAddFollowup(e: FormEvent) {
    e.preventDefault();
    if (!id) return;
    setError(null);
    setSaving(true);
    try {
      await endpoints.addFollowup(id, { followUpDate, note });
      setFollowUpDate("");
      setNote("");
      showToast("Follow-up note added", "success");
      reload();
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading || !customer) return <p className="text-muted">Loading…</p>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">{customer.name}</h1>
          <p className="mt-1 text-sm text-muted">{customer.businessName || "No business name on file"}</p>
        </div>
        {canManage && (
          <Button variant="secondary" onClick={() => navigate(`/customers/${customer.id}/edit`)}>
            Edit
          </Button>
        )}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="rounded-lg border border-border bg-white p-5">
            <h2 className="font-medium text-ink">Details</h2>
            <dl className="mt-3 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted">Mobile</dt>
                <dd className="font-mono">{customer.mobile}</dd>
              </div>
              <div>
                <dt className="text-muted">Email</dt>
                <dd>{customer.email || "—"}</dd>
              </div>
              <div>
                <dt className="text-muted">Type</dt>
                <dd>{customer.customerType}</dd>
              </div>
              <div>
                <dt className="text-muted">Status</dt>
                <dd>
                  <CustomerStatusBadge status={customer.status} />
                </dd>
              </div>
              <div>
                <dt className="text-muted">GST number</dt>
                <dd>{customer.gstNumber || "—"}</dd>
              </div>
              <div>
                <dt className="text-muted">Follow-up date</dt>
                <dd>{customer.followUpDate ? new Date(customer.followUpDate).toLocaleDateString() : "—"}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-muted">Address</dt>
                <dd>{customer.address || "—"}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-muted">Notes</dt>
                <dd>{customer.notes || "—"}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-border bg-white p-5">
            <h2 className="font-medium text-ink">Challan history</h2>
            {customer.challans && customer.challans.length > 0 ? (
              <ul className="mt-3 divide-y divide-border">
                {customer.challans.map((c) => (
                  <li key={c.id} className="flex items-center justify-between py-2 text-sm">
                    <Link to={`/challans/${c.id}`} className="font-mono text-primary hover:underline">
                      {c.challanNumber}
                    </Link>
                    <ChallanStatusBadge status={c.status} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted">No challans created for this customer yet.</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-white p-5">
            <h2 className="font-medium text-ink">Follow-up notes</h2>
            {customer.followups && customer.followups.length > 0 ? (
              <ul className="mt-3 space-y-3">
                {customer.followups.map((f) => (
                  <li key={f.id} className="border-l-2 border-tag pl-3 text-sm">
                    <p className="font-mono text-xs text-muted">
                      {new Date(f.followUpDate).toLocaleDateString()}
                    </p>
                    <p className="mt-0.5">{f.note}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted">No follow-up notes yet.</p>
            )}

            {canManage && (
              <form onSubmit={handleAddFollowup} className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
                <Input
                  label="Follow-up date"
                  type="date"
                  required
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                />
                <Textarea
                  label="Note"
                  required
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Discussed pricing for next order…"
                />
                {error && <p className="text-xs text-danger">{error}</p>}
                <Button type="submit" variant="secondary" disabled={saving}>
                  {saving ? "Adding…" : "Add note"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
