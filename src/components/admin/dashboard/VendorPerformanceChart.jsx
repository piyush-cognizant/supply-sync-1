import React, { useState, useEffect } from "react";
import performanceMetricsService from "@/services/performance-metrics.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

const VendorPerformanceChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      const response = await performanceMetricsService.getAll();
      if (response.success && Array.isArray(response.data)) {
        const chartData = response.data.map((metric, index) => ({
          vendor: `Vendor ${index + 1}`,
          performance: metric.qualityScore,
          onTimeDelivery: metric.onTimeDeliveryRate,
        }));
        setData(chartData);
      }
    } catch (error) {
      console.error("Error fetching performance data:", error);
    } finally {
      setLoading(false);
    }
  };

  const chartConfig = {
    performance: {
      label: "Quality Score",
      color: "#3b82f6",
    },
    onTimeDelivery: {
      label: "On-Time Delivery %",
      color: "#10b981",
    },
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Vendor Performance</CardTitle>
        <CardDescription>Quality scores and on-time delivery rates</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-72 w-full" />
        ) : data.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="vendor" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Legend />
                <Bar dataKey="performance" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="onTimeDelivery" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="h-72 flex items-center justify-center text-muted-foreground">
            No performance data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VendorPerformanceChart;
