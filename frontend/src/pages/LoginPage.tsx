import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiErrorMessage } from "../services/api";
import { Button, Input } from "../components/Form";

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  if (user) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); setError(null); setSubmitting(true);
    try { await login(email, password); navigate("/dashboard"); }
    catch (err) { setError(apiErrorMessage(err)); }
    finally { setSubmitting(false); }
  }

  return (
    <div className="login-page">
      <section className="login-brand-panel" aria-label="Product introduction">
        <div className="brand"><span className="brand-mark">O</span><span className="brand-copy"><small style={{ color: "rgba(255,255,255,.65)" }}>Operations portal</small><strong>Mini ERP + CRM</strong></span></div>
        <p className="login-kicker">Built for operational clarity</p>
        <h1>Run customer, stock and dispatch operations from one calm workspace.</h1>
        <p>Manage your day-to-day sales operations with clear customer records, real-time inventory and dependable challan workflows.</p>
      </section>
      <main className="login-form-panel">
        <form onSubmit={handleSubmit} className="login-card">
          <p className="text-sm font-medium text-primary">Welcome back</p>
          <h2>Sign in to your workspace</h2>
          <p className="login-helper">Use your company account to continue to the operations portal.</p>
          <div className="flex flex-col gap-4">
            <Input label="Email address" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" autoFocus />
            <Input label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
            {error && <p className="text-sm text-danger" role="alert">{error}</p>}
            <Button type="submit" disabled={submitting} className="w-full">{submitting ? "Signing in…" : "Sign in"}</Button>
          </div>
          <p className="login-demo">Demo accounts: admin, sales, warehouse, or accounts @erp.test<br />Password: Password123!</p>
        </form>
      </main>
    </div>
  );
}
