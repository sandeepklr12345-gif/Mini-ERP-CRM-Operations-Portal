import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as endpoints from "../services/endpoints";
import { Customer } from "../types";
import { DataTable } from "../components/DataTable";
import { Pagination } from "../components/Pagination";
import { Button, Input, Select } from "../components/Form";
import { CustomerStatusBadge } from "../components/Badges";
import { useAuth } from "../context/AuthContext";

export function CustomersListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const canManage = user?.role === "ADMIN" || user?.role === "SALES";

  const [rows, setRows] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    setLoading(true);
    endpoints
      .listCustomers({ page: String(page), limit: "10", search: search || undefined, status: status || undefined })
      .then((res) => {
        setRows(res.data);
        setTotalPages(res.totalPages);
      })
      .finally(() => setLoading(false));
  }, [page, search, status]);

  return (
    <div>
      <div className="page-heading">
        <div><h1>Customers</h1><p>Manage customer relationships, contacts and follow-ups.</p></div>
        {canManage && (
          <Button onClick={() => navigate("/customers/new")}>Add customer</Button>
        )}
      </div>

      <div className="mt-4 flex gap-3">
        <Input
          placeholder="Search name, mobile, business…"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="w-72"
        />
        <Select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="w-40"
        >
          <option value="">All statuses</option>
          <option value="LEAD">Lead</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </Select>
      </div>

      <div className="mt-4">
        <DataTable
          rows={rows}
          loading={loading}
          rowKey={(r) => r.id}
          onRowClick={(r) => navigate(`/customers/${r.id}`)}
          emptyTitle="No customers yet"
          emptyHint="Add your first customer to start tracking leads and orders."
          columns={[
            { header: "Name", render: (r) => <span className="font-medium">{r.name}</span> },
            { header: "Business", render: (r) => r.businessName || "—" },
            { header: "Mobile", render: (r) => <span className="font-mono text-xs">{r.mobile}</span> },
            { header: "Type", render: (r) => r.customerType },
            { header: "Status", render: (r) => <CustomerStatusBadge status={r.status} /> },
          ]}
        />
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>

      {!canManage && (
        <p className="mt-3 text-xs text-muted">
          <Link to="#" className="pointer-events-none">
            View-only access for your role.
          </Link>
        </p>
      )}
    </div>
  );
}
