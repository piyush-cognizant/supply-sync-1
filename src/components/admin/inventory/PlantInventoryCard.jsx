import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * @typedef {Object} InventoryItem
 * @property {string} id - Inventory ID
 * @property {string} plantId - Plant ID
 * @property {string} productId - Product ID
 * @property {number} quantityAvailable - Current quantity
 * @property {number} reorderLevel - Reorder level
 */

/**
 * PlantInventoryCard Component
 * @param {Object} props
 * @param {Object} props.plant - Plant data
 * @param {InventoryItem[]} props.inventory - Array of inventory items for this plant
 * @param {Object} props.products - Map of product data
 * @param {Function} props.onRestock - Callback when restock button is clicked
 */
const PlantInventoryCard = ({ plant, inventory, products, onRestock }) => {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{plant.name}</CardTitle>
            <CardDescription>{plant.location}</CardDescription>
          </div>
          <Badge variant="outline">{inventory.length} product(s)</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {inventory.length > 0 ? (
          <div className="space-y-3">
            {inventory.map((item) => {
              const product = products[item.productId];
              const isLowStock = item.quantityAvailable < item.reorderLevel;
              const stockPercentage = (item.quantityAvailable / item.reorderLevel) * 100;

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{product?.name || "Unknown Product"}</p>
                      {isLowStock && (
                        <Badge variant="destructive" className="text-xs">
                          Low Stock
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Available: <span className="font-semibold">{item.quantityAvailable}</span>{" "}
                      {product?.unit || "units"} | Reorder at:{" "}
                      <span className="font-semibold">{item.reorderLevel}</span> {product?.unit || "units"}
                    </p>
                    <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          isLowStock ? "bg-destructive" : "bg-success"
                        }`}
                        style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                  {isLowStock && (
                    <Button
                      size="sm"
                      onClick={() => onRestock(item.plantId, item.productId)}
                      className="ml-4 flex-shrink-0"
                    >
                      Restock
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No inventory data for this plant
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PlantInventoryCard;
