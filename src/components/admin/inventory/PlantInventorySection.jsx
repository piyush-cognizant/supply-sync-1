import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { WarehouseIcon } from "@hugeicons/core-free-icons";
import PlantInventoryCard from "./PlantInventoryCard";

/**
 * PlantInventorySection Component
 * @param {Object} props
 * @param {Object[]} props.plants - Array of plant data
 * @param {Object[]} props.inventory - Array of all inventory items
 * @param {Object} props.products - Map of product data
 * @param {Function} props.onRestock - Callback when restock button is clicked
 */
const PlantInventorySection = ({ plants, inventory, products, onRestock }) => {
  const getInventoryByPlant = (plantId) => {
    return inventory.filter((item) => item.plantId === plantId);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <HugeiconsIcon icon={WarehouseIcon} className="text-primary" />
        Inventory by Location
      </h2>

      {plants.length > 0 ? (
        <div className="grid gap-4">
          {plants.map((plant) => {
            const plantInventory = getInventoryByPlant(plant.id);
            return (
              <PlantInventoryCard
                key={plant.id}
                plant={plant}
                inventory={plantInventory}
                products={products}
                onRestock={onRestock}
              />
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <HugeiconsIcon icon={WarehouseIcon} size={32} className="text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No plants configured</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlantInventorySection;
