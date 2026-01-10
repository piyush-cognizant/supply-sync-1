import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "@/store/auth.store";
import purchaseOrderService from "@/services/purchase-order.service";
import purchaseOrderItemService from "@/services/purchase-order-item.service";
import orderActionService from "@/services/order-action.service";
import plantService from "@/services/plant.service";
import productService from "@/services/product.service";
import { formatDate } from "@/lib/date-time";
import { PURCHASE_ORDER_STATUS, ORDER_ACTION_STATUS } from "@/constants/entities";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Package01Icon,
  ViewIcon,
  ArrowRight01Icon,
  Alert02Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

const STATUS_COLORS = {
  [PURCHASE_ORDER_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
  [PURCHASE_ORDER_STATUS.CONFIRMED]: "bg-blue-100 text-blue-800",
  [PURCHASE_ORDER_STATUS.SHIPPED]: "bg-purple-100 text-purple-800",
  [PURCHASE_ORDER_STATUS.DELIVERED]: "bg-green-100 text-green-800",
  [PURCHASE_ORDER_STATUS.CANCELLED]: "bg-red-100 text-red-800",
};

const VendorPurchaseOrdersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [plants, setPlants] = useState({});
  const [products, setProducts] = useState({});
  const [pendingActions, setPendingActions] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // View details dialog state
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  useEffect(() => {
    fetchMasterData();
  }, []);

  useEffect(() => {
    if (user?.vendorId) {
      fetchPurchaseOrders();
      fetchPendingActions();
    }
  }, [currentPage, user?.vendorId]);

  const fetchMasterData = async () => {
    try {
      const [plantsRes, productsRes] = await Promise.all([
        plantService.getAll(),
        productService.getAll(),
      ]);

      if (plantsRes.success) {
        const plantMap = {};
        plantsRes.data.forEach((plant) => {
          plantMap[plant.id] = plant;
        });
        setPlants(plantMap);
      }

      if (productsRes.success) {
        const productMap = {};
        productsRes.data.forEach((product) => {
          productMap[product.id] = product;
        });
        setProducts(productMap);
      }
    } catch (error) {
      console.error("Error fetching master data:", error);
    }
  };

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch orders for this vendor with pagination
      const queryParams = new URLSearchParams({
        vendorId: user.vendorId,
        _page: currentPage,
        _limit: ITEMS_PER_PAGE,
        _sort: "orderDate",
        _order: "desc",
      });

      const response = await purchaseOrderService.getAll({
        vendorId: user.vendorId,
        _page: currentPage,
        _limit: ITEMS_PER_PAGE,
        _sort: "orderDate",
        _order: "desc",
      });

      if (response.success) {
        // Filter for this vendor (since getAll doesn't filter by vendorId)
        const vendorOrders = response.data.filter(
          (order) => order.vendorId === user.vendorId
        );
        setPurchaseOrders(vendorOrders);
        setTotalItems(vendorOrders.length);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
      toast.error("Failed to fetch purchase orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingActions = async () => {
    try {
      const response = await orderActionService.getByVendorId(user.vendorId);
      
      if (response.success) {
        // Create a map of purchaseOrderId -> hasPendingAction
        const pendingMap = {};
        response.data.forEach((action) => {
          if (action.status === ORDER_ACTION_STATUS.PENDING) {
            pendingMap[action.purchaseOrderId] = true;
          }
        });
        setPendingActions(pendingMap);
      }
    } catch (error) {
      console.error("Error fetching pending actions:", error);
    }
  };

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleViewDetails = async (order) => {
    setViewOrder(order);
    setViewDetailsOpen(true);
    setLoadingItems(true);

    try {
      const response = await purchaseOrderItemService.getByPurchaseOrderId(order.id);
      if (response.success) {
        setOrderItems(response.data || []);
      } else {
        toast.error("Failed to load order items");
        setOrderItems([]);
      }
    } catch (error) {
      console.error("Error fetching order items:", error);
      toast.error("Failed to load order items");
      setOrderItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  const handleOpenOrder = (orderId) => {
    navigate(`/vendor/manage/orders/${orderId}`);
  };

  const getStatusBadge = (status) => {
    const colorClass = STATUS_COLORS[status] || "bg-gray-100 text-gray-800";
    return <Badge className={colorClass}>{status}</Badge>;
  };

  if (loading && purchaseOrders.length === 0) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-80" />
        <Skeleton className="h-32" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate("/vendor")} className="cursor-pointer">
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Purchase Orders</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Purchase Orders</h1>
        <p className="text-muted-foreground mt-2">
          View and manage purchase orders assigned to you.
        </p>
      </div>

      {/* Purchase Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={Package01Icon} size={20} />
            My Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          {purchaseOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <HugeiconsIcon icon={Package01Icon} size={48} className="mb-4 opacity-50" />
              <p className="text-lg">No purchase orders found</p>
              <p className="text-sm">Orders assigned to you will appear here</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Plant</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Expected Delivery</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseOrders.map((order) => {
                    const hasPendingAction = pendingActions[order.id];
                    return (
                      <TableRow key={order.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            #{order.id.slice(0, 6).toUpperCase()}
                            {hasPendingAction && (
                              <span 
                                className="relative flex h-3 w-3"
                                title="Pending action request"
                              >
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{plants[order.plantId]?.name || order.plantId}</TableCell>
                        <TableCell>{formatDate(order.orderDate)}</TableCell>
                        <TableCell>
                          {order.actualDeliveryDate ? (
                            <div className="space-y-1">
                              <span className="text-green-600">{formatDate(order.actualDeliveryDate)}</span>
                              <p className="text-xs text-muted-foreground">Delivered</p>
                            </div>
                          ) : (
                            formatDate(order.expectedDeliveryDate)
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewDetails(order)}
                              title="Quick View"
                            >
                              <HugeiconsIcon icon={ViewIcon} size={16} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenOrder(order.id)}
                              className="gap-1"
                            >
                              {hasPendingAction && (
                                <HugeiconsIcon icon={Alert02Icon} size={14} className="text-yellow-600" />
                              )}
                              Open
                              <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(currentPage - 1)}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(currentPage + 1)}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={Package01Icon} size={20} />
              Order #{viewOrder?.id?.slice(0, 6).toUpperCase()}
            </DialogTitle>
            <DialogDescription>
              Order details and items
            </DialogDescription>
          </DialogHeader>

          {viewOrder && (
            <div className="space-y-4">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Plant:</span>
                  <p className="font-medium">{plants[viewOrder.plantId]?.name || viewOrder.plantId}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <div className="mt-1">{getStatusBadge(viewOrder.status)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Order Date:</span>
                  <p className="font-medium">{formatDate(viewOrder.orderDate)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Expected Delivery:</span>
                  <p className="font-medium">{formatDate(viewOrder.expectedDeliveryDate)}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-medium mb-2">Order Items</h4>
                {loadingItems ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10" />
                  </div>
                ) : orderItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No items found</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead>Unit</TableHead>
                        {orderItems[0]?.unitPrice && <TableHead className="text-right">Unit Price</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{products[item.productId]?.name || item.productId}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                          {item.unitPrice && (
                            <TableCell className="text-right">₹{item.unitPrice}</TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              {/* Action Button */}
              <div className="flex justify-end pt-4">
                <Button onClick={() => {
                  setViewDetailsOpen(false);
                  handleOpenOrder(viewOrder.id);
                }} className="gap-2">
                  Open Full Details
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorPurchaseOrdersPage;
