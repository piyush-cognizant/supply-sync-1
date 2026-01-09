import React, { useState, useEffect } from "react";
import purchaseOrderService from "@/services/purchase-order.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

const OrderStatusChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderData();
  }, []);

  const fetchOrderData = async () => {
    try {
      setLoading(true);
      const response = await purchaseOrderService.getAll();
      if (response.success && Array.isArray(response.data)) {
        const statusCounts = {
          DELIVERED: 0,
          PENDING: 0,
          CANCELLED: 0,
        };

        response.data.forEach((order) => {
          const status = order.status || "PENDING";
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        const chartData = Object.entries(statusCounts)
          .filter(([_, count]) => count > 0)
          .map(([status, count]) => ({
            name: status,
            value: count,
          }));

        setData(chartData);
      }
    } catch (error) {
      console.error("Error fetching order data:", error);
    } finally {
      setLoading(false);
    }
  };

  const chartConfig = {
    DELIVERED: {
      label: "Delivered",
      color: "#10b981",
    },
    PENDING: {
      label: "Pending",
      color: "#f59e0b",
    },
    CANCELLED: {
      label: "Cancelled",
      color: "#ef4444",
    },
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Purchase Order Status</CardTitle>
        <CardDescription>Distribution of order statuses</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-72 w-full" />
        ) : data.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="h-72 flex items-center justify-center text-muted-foreground">
            No order data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderStatusChart;
