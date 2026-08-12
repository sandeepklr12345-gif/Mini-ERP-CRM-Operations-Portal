import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import * as endpoints from "../services/endpoints";
import { DashboardStats } from "../types";
import { ChallanStatusBadge } from "../components/Badges";
import { useAuth } from "../context/AuthContext";

type MetricIcon = "customers" | "products" | "alert" | "draft" | "confirmed";
function MetricGlyph({ icon }: { icon: MetricIcon }) {
  const shapes: Record<MetricIcon, ReactNode> = {
    customers: <><circle cx="12" cy="8" r="3"/><path d="M5 20c.8-3.1 3.1-5 7-5s6.2 1.9 7 5"/></>,
    products: <><path d="m4 7 8-4 8 4v10l-8 4-8-4z"/><path d="m4 7 8 4 8-4M12 11v10"/></>,
    alert: <><path d="M12 3 3.8 19h16.4L12 3Z"/><path d="M12 9v4M12 16h.01"/></>,
    draft: <><path d="M6 3h9l3 3v15H6z"/><path d="M15 3v4h4M9 12h6M9 16h4"/></>,
    confirmed: <><circle cx="12" cy="12" r="8.5"/><path d="m8.5 12 2.2 2.2 4.8-5"/></>,
  };
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[icon]}</svg>;
}
function StatCard({ label, value, icon, tone }: { label: string; value: number; icon: MetricIcon; tone?: "warning" | "danger" }) {
  return <div className={`stat-card ${tone ?? ""}`}><div className="stat-card__top"><span>{label}</span><span className="stat-card__icon"><MetricGlyph icon={icon} /></span></div><p className="stat-card__value">{value}</p></div>;
}

export function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { endpoints.getDashboard().then(setStats).finally(() => setLoading(false)); }, []);

  return <div>
    <div className="page-heading"><div><h1>Operations overview</h1><p>Welcome back, {user?.name}. Here is a live view of your workspace.</p></div></div>
    {loading || !stats ? <div className="section-card mt-6 p-6 text-muted">Loading your operations overview…</div> : <>
      <section className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5" aria-label="Operational summary">
        <StatCard label="Total customers" value={stats.totalCustomers} icon="customers" />
        <StatCard label="Total products" value={stats.totalProducts} icon="products" />
        <StatCard label="Low stock" value={stats.lowStockProducts} icon="alert" tone="warning" />
        <StatCard label="Draft challans" value={stats.draftChallans} icon="draft" />
        <StatCard label="Confirmed challans" value={stats.confirmedChallans} icon="confirmed" />
      </section>
      <section className="section-card mt-6">
        <div className="section-card__header"><div><h2>Recent challans</h2><p className="mt-1 text-sm text-muted">Latest dispatch records from your team.</p></div><Link to="/challans">View all</Link></div>
        {stats.recentChallans.length === 0 ? <p className="px-4 py-8 text-center text-sm text-muted">No challans have been created yet.</p> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b border-border bg-paper"><tr><th className="px-4 py-3 font-medium text-muted">Challan</th><th className="px-4 py-3 font-medium text-muted">Customer</th><th className="px-4 py-3 font-medium text-muted">Status</th><th className="px-4 py-3 text-right font-medium text-muted">Created</th></tr></thead><tbody>{stats.recentChallans.map((c) => <tr key={c.id} className="border-b border-border last:border-0"><td className="px-4 py-3 font-mono text-xs">{c.challanNumber}</td><td className="px-4 py-3">{"name" in (c.customer ?? {}) ? (c.customer as { name: string }).name : "—"}</td><td className="px-4 py-3"><ChallanStatusBadge status={c.status} /></td><td className="px-4 py-3 text-right text-muted">{new Date(c.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table></div>}
      </section>
    </>}
  </div>;
}
