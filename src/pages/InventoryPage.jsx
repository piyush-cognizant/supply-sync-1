import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import inventoryService from "@/services/inventory.service";
import plantService from "@/services/plant.service";
import productService from "@/services/product.service";
import StockAlertsCard from "@/components/admin/inventory/StockAlertsCard";
import PlantInventorySection from "@/components/admin/inventory/PlantInventorySection";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const InventoryPage = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [plants, setPlants] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [inventoryRes, plantsRes, productsRes] = await Promise.all([
        inventoryService.getAll(),
        plantService.getAll(),
        productService.getAll(),
      ]);

      if (inventoryRes.success) {
        setInventory(inventoryRes.data || []);
      }

      if (plantsRes.success) {
        setPlants(plantsRes.data || []);
      }

      if (productsRes.success) {
        // Create a map of products by ID for quick lookup
        const productMap = {};
        productsRes.data.forEach((product) => {
          productMap[product.id] = product;
        });
        setProducts(productMap);
      }
    } catch (error) {
      console.error("Error fetching inventory data:", error);
      toast.error("Failed to fetch inventory data");
    } finally {
      setLoading(false);
    }
  };

  // Get all low stock items (quantity < reorder level)
  const lowStockItems = inventory.filter((item) => item.quantityAvailable < item.reorderLevel);

  const handleRestock = (plantId, productId) => {
    // Navigate to purchase order creation page (we'll create this later)
    navigate(`/admin/manage/purchase-orders/create?plantId=${plantId}&productId=${productId}`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-80" />
        <Skeleton className="h-32" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate("/admin")} className="cursor-pointer">
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Inventory</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
        <p className="text-muted-foreground mt-2">Manage stock levels and reorder products</p>
      </div>

      {/* Stock Alerts Card */}
      <StockAlertsCard
        lowStockItems={lowStockItems}
        plants={plants}
        products={products}
        onRestock={handleRestock}
      />

      {/* Plant-based Inventory Section */}
      <PlantInventorySection
        plants={plants}
        inventory={inventory}
        products={products}
        onRestock={handleRestock}
      />
    </div>
  );
};

export default InventoryPage;
