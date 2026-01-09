import React, { useState, useEffect } from "react";
import inventoryService from "@/services/inventory.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

const InventoryStatusCard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const response = await inventoryService.getAll();
      if (response.success && Array.isArray(response.data)) {
        const chartData = response.data.map((item, index) => ({
          product: `Product ${index + 1}`,
          available: item.quantityAvailable,
          reorderLevel: item.reorderLevel,
          status: item.quantityAvailable < item.reorderLevel ? "Low Stock" : "In Stock",
        }));
        setData(chartData);
      }
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    } finally {
      setLoading(false);
    }
  };

  const chartConfig = {
    available: {
      label: "Available Quantity",
      color: "#3b82f6",
    },
    reorderLevel: {
      label: "Reorder Level",
      color: "#f59e0b",
    },
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Inventory Status</CardTitle>
        <CardDescription>Current inventory levels vs reorder thresholds</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-72 w-full" />
        ) : data.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="product" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="available"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6" }}
                />
                <Line
                  type="monotone"
                  dataKey="reorderLevel"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: "#f59e0b" }}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="h-72 flex items-center justify-center text-muted-foreground">
            No inventory data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InventoryStatusCard;
