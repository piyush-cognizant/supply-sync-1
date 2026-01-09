import React from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserMultipleIcon as Users,
  ShoppingCart01Icon as ShoppingCart,
  DeliveryBox01Icon as Package,
} from "@hugeicons/core-free-icons";

const QuickActionCard = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Manage Vendors",
      description: "View and manage all vendors",
      icon: Users,
      path: "/admin/manage/vendors",
      color: "bg-blue-500",
    },
    {
      title: "Purchase Orders",
      description: "View purchase orders",
      icon: ShoppingCart,
      path: "/admin/purchase-orders",
      color: "bg-green-500",
    },
    {
      title: "Inventory",
      description: "Check inventory levels",
      icon: Package,
      path: "/admin/inventory",
      color: "bg-purple-500",
    },
  ];

  return (
    <Card className="col-span-1 md:col-span-3 border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Access key management features</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {actions.map((action) => {
            return (
              <button
                key={action.path}
                onClick={() => navigate(action.path)}
                className="group flex flex-col items-start p-4 rounded-lg border border-border hover:bg-accent transition-colors hover:shadow-md"
              >
                <div className={`${action.color} p-3 rounded-lg mb-3`}>
                  <HugeiconsIcon icon={action.icon} className="text-white" />
                </div>
                <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                  {action.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionCard;
