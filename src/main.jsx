import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import { BrowserRouter, Routes, Route } from "react-router"
import AdminLayout from "./components/layouts/AdminLayout"
import VendorLayout from "./components/layouts/VendorLayout"
import RootLayout from "./components/layouts/RootLayout"
import LandingPage from "./pages/LandingPage"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<LandingPage />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<div>Welcome to Admin Dashboard</div>} />
            <Route path="manage/vendors" element={<div>All Vendors Page</div>} />
            <Route path="manage/vendors/:id" element={<div>Vendor Details Page</div>} />
            <Route path="purchase-orders" element={<div>All Purchase Orders Page</div>} />
            <Route path="inventory" element={<div>Inventory Page</div>} />
            <Route path="*" element={<div>Admin 404 Not Found</div>} />
          </Route>

          <Route path="/vendor" element={<VendorLayout />}>
            <Route index element={<div>Welcome to Vendor Dashboard</div>} />
            <Route path="purchase-orders" element={<div>Vendor Orders Page</div>} />
            <Route path="purchase-orders/:id" element={<div>Vendor Order Details Page</div>} />
            <Route path="profile" element={<div>Vendor Profile Page</div>} />
            <Route path="*" element={<div>Vendor 404 Not Found</div>} />
          </Route>
          
          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
