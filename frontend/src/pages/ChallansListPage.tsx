import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as endpoints from "../services/endpoints";
import { Challan } from "../types";
import { DataTable } from "../components/DataTable";
import { Pagination } from "../components/Pagination";
import { Button, Select } from "../components/Form";
import { ChallanStatusBadge } from "../components/Badges";
import { useAuth } from "../context/AuthContext";

export function ChallansListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const canCreate = user?.role === "ADMIN" || user?.role === "SALES";

  const [rows, setRows] = useState<Challan[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setLoading(true);
    endpoints
      .listChallans({ page: String(page), limit: "10", status: status || undefined })
      .then((res) => {
        setRows(res.data);
        setTotalPages(res.totalPages);
      })
      .finally(() => setLoading(false));
  }, [page, status]);

  return (
    <div>
      <div className="page-heading">
        <div><h1>Sales challans</h1><p>Track draft, confirmed and cancelled dispatch documents.</p></div>
        {canCreate && <Button onClick={() => navigate("/challans/new")}>New challan</Button>}
      </div>

      <div className="mt-4 flex gap-3">
        <Select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="w-48"
        >
          <option value="">All statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
        </Select>
      </div>

      <div className="mt-4">
        <DataTable
          rows={rows}
          loading={loading}
          rowKey={(r) => r.id}
          onRowClick={(r) => navigate(`/challans/${r.id}`)}
          emptyTitle="No challans yet"
          emptyHint="Create a sales challan to start recording dispatches."
          columns={[
            { header: "Challan #", render: (r) => <span className="font-mono text-xs">{r.challanNumber}</span> },
            {
              header: "Customer",
              render: (r) => ("name" in (r.customer ?? {}) ? (r.customer as { name: string }).name : "—"),
            },
            { header: "Total qty", render: (r) => <span className="font-mono">{r.totalQuantity}</span> },
            { header: "Status", render: (r) => <ChallanStatusBadge status={r.status} /> },
            { header: "Created", render: (r) => new Date(r.createdAt).toLocaleDateString() },
          ]}
        />
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  );
}
