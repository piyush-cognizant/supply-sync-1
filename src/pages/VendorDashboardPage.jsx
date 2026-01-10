import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "@/store/auth.store";
import vendorService from "@/services/vendor.service";
import purchaseOrderService from "@/services/purchase-order.service";
import orderActionService from "@/services/order-action.service";
import performanceMetricsService from "@/services/performance-metrics.service";
import vendorDocumentService from "@/services/vendor-document.service";
import { formatDate } from "@/lib/date-time";
import { 
  PURCHASE_ORDER_STATUS, 
  ORDER_ACTION_STATUS,
  VENDOR_STATUS 
} from "@/constants/entities";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Package01Icon,
  TruckIcon,
  Clock01Icon,
  UserIcon,
  Alert02Icon,
  CheckmarkCircle02Icon,
  StarIcon,
  File02Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

const STATUS_COLORS = {
  [VENDOR_STATUS.APPROVED]: "bg-green-100 text-green-800",
  [VENDOR_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
  [VENDOR_STATUS.SUSPENDED]: "bg-red-100 text-red-800",
  [VENDOR_STATUS.INACTIVE]: "bg-gray-100 text-gray-800",
};

const VendorDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    pendingActions: 0,
    totalDocuments: 0,
    verifiedDocuments: 0,
    onTimeDeliveryRate: 0,
    qualityScore: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    if (user?.vendorId) {
      fetchDashboardData();
    }
  }, [user?.vendorId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [vendorRes, ordersRes, actionsRes, metricsRes, docsRes] = await Promise.all([
        vendorService.getById(user.vendorId),
        purchaseOrderService.getByVendorId(user.vendorId),
        orderActionService.getByVendorId(user.vendorId),
        performanceMetricsService.getByVendorId(user.vendorId),
        vendorDocumentService.getByVendorId(user.vendorId),
      ]);

      if (vendorRes.success) {
        setVendor(vendorRes.data);
      }

      if (ordersRes.success && ordersRes.data) {
        const orders = ordersRes.data;
        
        // Calculate order stats
        const pendingOrders = orders.filter(o => o.status === PURCHASE_ORDER_STATUS.PENDING).length;
        const shippedOrders = orders.filter(o => o.status === PURCHASE_ORDER_STATUS.SHIPPED).length;
        const deliveredOrders = orders.filter(o => o.status === PURCHASE_ORDER_STATUS.DELIVERED).length;
        
        // Get recent orders (last 5)
        const sorted = [...orders].sort((a, b) => 
          new Date(b.orderDate) - new Date(a.orderDate)
        );
        setRecentOrders(sorted.slice(0, 5));

        setStats(prev => ({
          ...prev,
          totalOrders: orders.length,
          pendingOrders,
          shippedOrders,
          deliveredOrders,
        }));
      }

      if (actionsRes.success && actionsRes.data) {
        const pendingActions = actionsRes.data.filter(
          a => a.status === ORDER_ACTION_STATUS.PENDING
        ).length;
        
        setStats(prev => ({
          ...prev,
          pendingActions,
        }));
      }

      if (metricsRes.success && metricsRes.data && metricsRes.data.length > 0) {
        // Get the latest metrics
        const latestMetrics = metricsRes.data[metricsRes.data.length - 1];
        
        setStats(prev => ({
          ...prev,
          onTimeDeliveryRate: latestMetrics.onTimeDeliveryRate || 0,
          qualityScore: latestMetrics.qualityScore || 0,
        }));
      }

      if (docsRes.success && docsRes.data) {
        const docs = docsRes.data;
        const verifiedDocs = docs.filter(d => d.verified).length;
        
        setStats(prev => ({
          ...prev,
          totalDocuments: docs.length,
          verifiedDocuments: verifiedDocs,
        }));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const colorClass = STATUS_COLORS[status] || "bg-gray-100 text-gray-800";
    return <Badge className={colorClass}>{status}</Badge>;
  };

  const StatCard = ({ title, value, icon, subtext, loading }) => (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">{title}</p>
            {loading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <>
                <p className="text-2xl font-bold">{value}</p>
                {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
              </>
            )}
          </div>
          {icon && (
            <div className="p-2.5 bg-primary/10 rounded-lg">
              <HugeiconsIcon icon={icon} className="text-primary" size={20} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading && !vendor) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {vendor?.name || "Vendor"}!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Account Status:</span>
          {getStatusBadge(vendor?.status)}
        </div>
      </div>

      {/* Pending Actions Alert */}
      {stats.pendingActions > 0 && (
        <Card className="border-yellow-500 bg-yellow-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-full">
                <HugeiconsIcon icon={Alert02Icon} size={20} className="text-yellow-600" />
              </div>
              <div>
                <p className="font-medium text-yellow-800">
                  {stats.pendingActions} Pending Action Request{stats.pendingActions > 1 ? "s" : ""}
                </p>
                <p className="text-sm text-yellow-700">
                  You have action requests that need your attention
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate("/vendor/manage/orders")}
              className="border-yellow-500 text-yellow-700 hover:bg-yellow-100"
            >
              View Orders
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          icon={Package01Icon} 
          loading={loading}
        />
        <StatCard 
          title="Pending Orders" 
          value={stats.pendingOrders} 
          icon={Clock01Icon} 
          loading={loading}
        />
        <StatCard 
          title="In Transit" 
          value={stats.shippedOrders} 
          icon={TruckIcon} 
          loading={loading}
        />
        <StatCard 
          title="Delivered" 
          value={stats.deliveredOrders} 
          icon={CheckmarkCircle02Icon} 
          loading={loading}
        />
      </div>

      {/* Performance & Documents Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={StarIcon} size={20} />
              Performance Metrics
            </CardTitle>
            <CardDescription>
              Your latest performance evaluation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* On-Time Delivery Rate */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">On-Time Delivery Rate</span>
                <span className="font-medium">{stats.onTimeDeliveryRate}%</span>
              </div>
              <Progress value={stats.onTimeDeliveryRate} className="h-2" />
            </div>

            {/* Quality Score */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Quality Score</span>
                <span className="font-medium">{stats.qualityScore}/5.0</span>
              </div>
              <Progress value={(stats.qualityScore / 5) * 100} className="h-2" />
            </div>

            {stats.onTimeDeliveryRate === 0 && stats.qualityScore === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No performance data available yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Document Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <HugeiconsIcon icon={File02Icon} size={20} />
                Compliance Documents
              </CardTitle>
              <CardDescription>
                Your uploaded documents status
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/vendor/manage/profile")}>
              Manage
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between py-4">
              <div className="text-center flex-1">
                <p className="text-3xl font-bold">{stats.totalDocuments}</p>
                <p className="text-sm text-muted-foreground">Total Documents</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center flex-1">
                <p className="text-3xl font-bold text-green-600">{stats.verifiedDocuments}</p>
                <p className="text-sm text-muted-foreground">Verified</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center flex-1">
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.totalDocuments - stats.verifiedDocuments}
                </p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>

            {stats.totalDocuments === 0 && (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-2">
                  No documents uploaded yet
                </p>
                <Button variant="outline" size="sm" onClick={() => navigate("/vendor/manage/profile")}>
                  Upload Documents
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={Package01Icon} size={20} />
              Recent Orders
            </CardTitle>
            <CardDescription>
              Your latest purchase orders
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/vendor/manage/orders")}>
            View All
          </Button>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <HugeiconsIcon icon={Package01Icon} size={32} className="mx-auto mb-2 opacity-50" />
              <p>No orders yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div 
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/vendor/manage/orders/${order.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <HugeiconsIcon icon={Package01Icon} size={16} />
                    </div>
                    <div>
                      <p className="font-medium">Order #{order.id.slice(0, 6).toUpperCase()}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(order.orderDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      className={
                        order.status === PURCHASE_ORDER_STATUS.DELIVERED 
                          ? "bg-green-100 text-green-800"
                          : order.status === PURCHASE_ORDER_STATUS.PENDING
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === PURCHASE_ORDER_STATUS.SHIPPED
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }
                    >
                      {order.status}
                    </Badge>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => navigate("/vendor/manage/orders")} className="gap-2">
            <HugeiconsIcon icon={Package01Icon} size={16} />
            View Orders
          </Button>
          <Button variant="outline" onClick={() => navigate("/vendor/manage/profile")} className="gap-2">
            <HugeiconsIcon icon={UserIcon} size={16} />
            Update Profile
          </Button>
          <Button variant="outline" onClick={() => navigate("/vendor/manage/profile")} className="gap-2">
            <HugeiconsIcon icon={File02Icon} size={16} />
            Upload Documents
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorDashboardPage;
