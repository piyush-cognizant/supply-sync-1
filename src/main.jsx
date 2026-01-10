import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import { BrowserRouter, Routes, Route } from "react-router"
import AdminLayout from "./components/layouts/AdminLayout"
import VendorLayout from "./components/layouts/VendorLayout"
import RootLayout from "./components/layouts/RootLayout"
import LandingPage from "./pages/LandingPage"
import AdminDashboardPage from "./pages/AdminDashboardPage"
import VendorListingPage from "./pages/VendorListingPage"
import VendorDetailsPage from "./pages/VendorDetailsPage"
import InventoryPage from "./pages/InventoryPage"
import PurchaseOrderPage from "./pages/PurchaseOrderPage"
import VendorDashboardPage from "./pages/VendorDashboardPage"
import VendorPurchaseOrdersPage from "./pages/VendorPurchaseOrdersPage"
import VendorOrderDetailsPage from "./pages/VendorOrderDetailsPage"
import VendorProfilePage from "./pages/VendorProfilePage"
import NotFoundPage from "./pages/NotFoundPage"
import UnauthorizedPage from "./pages/UnauthorizedPage"
import { Toaster } from "./components/ui/sonner"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toaster position="top-center" />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<LandingPage />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={ <AdminDashboardPage /> } />
            <Route path="manage/vendors" element={<VendorListingPage />} />
            <Route path="manage/vendors/:vendorId" element={<VendorDetailsPage />} />
            <Route path="manage/inventory" element={<InventoryPage />} />
            <Route path="manage/purchase-orders" element={<PurchaseOrderPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route path="/vendor" element={<VendorLayout />}>
            <Route index element={<VendorDashboardPage />} />
            <Route path="manage/orders" element={<VendorPurchaseOrdersPage />} />
            <Route path="manage/orders/:id" element={<VendorOrderDetailsPage />} />
            <Route path="manage/profile" element={<VendorProfilePage />} />
            {/* Other invalid vendor routes */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Other root routes */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
