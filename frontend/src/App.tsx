import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AppLayout } from "./layouts/AppLayout";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { CustomersListPage } from "./pages/CustomersListPage";
import { CustomerFormPage } from "./pages/CustomerFormPage";
import { CustomerDetailPage } from "./pages/CustomerDetailPage";
import { ProductsListPage } from "./pages/ProductsListPage";
import { ProductFormPage } from "./pages/ProductFormPage";
import { InventoryPage } from "./pages/InventoryPage";
import { InventoryMovementsPage } from "./pages/InventoryMovementsPage";
import { ChallansListPage } from "./pages/ChallansListPage";
import { ChallanFormPage } from "./pages/ChallanFormPage";
import { ChallanDetailPage } from "./pages/ChallanDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />

              <Route path="/customers" element={<CustomersListPage />} />
              <Route path="/customers/new" element={<CustomerFormPage />} />
              <Route path="/customers/:id" element={<CustomerDetailPage />} />
              <Route path="/customers/:id/edit" element={<CustomerFormPage />} />

              <Route path="/products" element={<ProductsListPage />} />
              <Route path="/products/new" element={<ProductFormPage />} />
              <Route path="/products/:id/edit" element={<ProductFormPage />} />

              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/inventory/movements" element={<InventoryMovementsPage />} />

              <Route path="/challans" element={<ChallansListPage />} />
              <Route path="/challans/new" element={<ChallanFormPage />} />
              <Route path="/challans/:id" element={<ChallanDetailPage />} />

              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
