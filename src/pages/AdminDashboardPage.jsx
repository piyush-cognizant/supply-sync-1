import React, { useState, useEffect } from "react";
import apiService from "@/services/api.service";
import {
  VENDOR_ENDPOINT,
  PURCHASE_ORDERS_ENDPOINT,
  INVENTORY_ENDPOINT,
  PERFORMANCE_METRICS_ENDPOINT,
} from "@/constants/api-endpoints";
import QuickActionCard from "@/components/admin/dashboard/QuickActionCard";
import StatsCard from "@/components/admin/dashboard/StatsCard";
import VendorPerformanceChart from "@/components/admin/dashboard/VendorPerformanceChart";
import InventoryStatusCard from "@/components/admin/dashboard/InventoryStatusCard";
import OrderStatusChart from "@/components/admin/dashboard/OrderStatusChart";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalVendors: 0,
    totalOrders: 0,
    totalInventory: 0,
    avgPerformance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [vendorRes, ordersRes, inventoryRes, metricsRes] = await Promise.all(
        [
          apiService.sendRequest(VENDOR_ENDPOINT.GET),
          apiService.sendRequest(PURCHASE_ORDERS_ENDPOINT.GET),
          apiService.sendRequest(INVENTORY_ENDPOINT.GET),
          apiService.sendRequest(PERFORMANCE_METRICS_ENDPOINT.GET),
        ]
      );

      const totalInventory =
        inventoryRes.success && Array.isArray(inventoryRes.data)
          ? inventoryRes.data.reduce((sum, item) => sum + item.quantityAvailable, 0)
          : 0;

      const avgPerformance =
        metricsRes.success && Array.isArray(metricsRes.data) && metricsRes.data.length > 0
          ? (
              metricsRes.data.reduce((sum, item) => sum + item.qualityScore, 0) /
              metricsRes.data.length
            ).toFixed(1)
          : 0;

      setStats({
        totalVendors: vendorRes.success ? vendorRes.data.length : 0,
        totalOrders: ordersRes.success ? ordersRes.data.length : 0,
        totalInventory,
        avgPerformance,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here's your supply chain overview.</p>
      </div>

      {/* Quick Actions Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickActionCard />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Vendors" value={stats.totalVendors} icon="building-2" loading={loading} />
        <StatsCard title="Purchase Orders" value={stats.totalOrders} icon="package" loading={loading} />
        <StatsCard title="Inventory Units" value={stats.totalInventory.toLocaleString()} icon="box" loading={loading} />
        <StatsCard title="Avg Performance" value={`${stats.avgPerformance}/5`} icon="trending-up" loading={loading} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VendorPerformanceChart />
        <OrderStatusChart />
      </div>

      {/* Inventory Status */}
      <div className="grid grid-cols-1">
        <InventoryStatusCard />
      </div>
    </div>
  );
};

export default AdminDashboardPage;