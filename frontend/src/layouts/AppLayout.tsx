import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { Role } from "../types";

type IconName = "dashboard" | "customers" | "products" | "inventory" | "challans" | "menu";

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    customers: <><circle cx="12" cy="8" r="3.5"/><path d="M4.5 20c.8-3.2 3.3-5 7.5-5s6.7 1.8 7.5 5"/></>,
    products: <><path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5z"/><path d="M4 7.5 12 12l8-4.5M12 12v9"/></>,
    inventory: <><path d="M4 7h16v13H4z"/><path d="M8 7V4h8v3M8 12h8M8 16h5"/></>,
    challans: <><path d="M6 3h9l3 3v15H6z"/><path d="M15 3v4h4M9 12h6M9 16h6"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
  };
  return <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

interface NavItem { to: string; label: string; icon: IconName; roles: Role[]; }

const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard", roles: ["ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"] },
  { to: "/customers", label: "Customers", icon: "customers", roles: ["ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"] },
  { to: "/products", label: "Products", icon: "products", roles: ["ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"] },
  { to: "/inventory", label: "Inventory", icon: "inventory", roles: ["ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"] },
  { to: "/challans", label: "Challans", icon: "challans", roles: ["ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"] },
];

function pageLabel(pathname: string) {
  if (pathname.startsWith("/customers")) return "Customers";
  if (pathname.startsWith("/products")) return "Products";
  if (pathname.startsWith("/inventory")) return "Inventory";
  if (pathname.startsWith("/challans")) return "Sales challans";
  return "Dashboard";
}

export function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  if (!user) return null;
  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(user.role));
  const initials = user.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="app-shell">
      <aside className={`app-sidebar ${menuOpen ? "open" : ""}`}>
        <div className="brand"><span className="brand-mark">O</span><span className="brand-copy"><small>Operations portal</small><strong>Mini ERP + CRM</strong></span></div>
        <p className="nav-label">Workspace</p>
        <nav className="app-nav" aria-label="Primary navigation">
          {visibleItems.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={() => setMenuOpen(false)}>
              <Icon name={item.icon} />{item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-user">
          <div className="flex items-center gap-2"><span className="avatar">{initials}</span><div><div className="text-sm font-medium text-ink">{user.name}</div><span className="role-badge">{user.role}</span></div></div>
          <button className="logout-button" onClick={logout}>Sign out</button>
        </div>
      </aside>
      <div className="app-main">
        <header className="app-header">
          <button className="mobile-menu" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation"><Icon name="menu" /></button>
          <div className="header-context"><strong>{pageLabel(location.pathname)}</strong><span> &nbsp;/&nbsp; Operations portal</span></div>
          <div className="flex items-center gap-2"><span className="text-sm text-muted">{user.email}</span><span className="avatar">{initials}</span></div>
        </header>
        <main className="page-container"><Outlet /></main>
      </div>
    </div>
  );
}
