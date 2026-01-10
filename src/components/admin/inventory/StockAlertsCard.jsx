import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, Package02Icon } from "@hugeicons/core-free-icons";

/**
 * @typedef {Object} StockAlert
 * @property {string} id - Inventory ID
 * @property {string} plantId - Plant ID
 * @property {string} productId - Product ID
 * @property {number} quantityAvailable - Current quantity
 * @property {number} reorderLevel - Reorder level
 */

/**
 * StockAlertsCard Component
 * @param {Object} props
 * @param {StockAlert[]} props.lowStockItems - Array of low stock items
 * @param {Object} props.plants - Map of plant data
 * @param {Object} props.products - Map of product data
 * @param {Function} props.onRestock - Callback when restock button is clicked
 */
const StockAlertsCard = ({ lowStockItems, plants, products, onRestock }) => {
  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HugeiconsIcon icon={AlertCircleIcon} size={24} className="text-destructive" />
          Stock Alerts
        </CardTitle>
        <CardDescription>
          {lowStockItems.length} product(s) below reorder level
        </CardDescription>
      </CardHeader>
      <CardContent>
        {lowStockItems.length > 0 ? (
          <div className="space-y-3">
            {lowStockItems.map((item) => {
              const plant = plants.find((p) => p.id === item.plantId);
              const product = products[item.productId];
              const stockPercentage = (item.quantityAvailable / item.reorderLevel) * 100;

              return (
                <div
                  key={`${item.id}-alert`}
                  className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-destructive/20"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {product?.name || "Unknown Product"} - {plant?.name || "Unknown Plant"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Current: <span className="font-semibold text-destructive">{item.quantityAvailable}</span>{" "}
                      {product?.unit || "units"} | Reorder Level:{" "}
                      <span className="font-semibold">{item.reorderLevel}</span> {product?.unit || "units"}
                    </p>
                    <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-destructive transition-all"
                        style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onRestock(item.plantId, item.productId)}
                    className="ml-4 flex-shrink-0"
                  >
                    Restock
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6">
            <HugeiconsIcon icon={Package02Icon} size={32} className="text-success/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">All products are well stocked</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StockAlertsCard;
