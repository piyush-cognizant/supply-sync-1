import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Building02Icon,
  DeliveryBox01Icon,
  Package01Icon,
  ArrowUp01Icon,
} from "@hugeicons/core-free-icons";

const iconMap = {
  "building-2": Building02Icon,
  package: DeliveryBox01Icon,
  box: Package01Icon,
  "trending-up": ArrowUp01Icon,
};

const StatsCard = ({ title, value, icon, loading }) => {
  const IconComponent = iconMap[icon];

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">{title}</p>
            {loading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <p className="text-2xl font-bold">{value}</p>
            )}
          </div>
          {IconComponent && (
            <div className="p-2.5 bg-primary/10 rounded-lg">
              <HugeiconsIcon icon={IconComponent} className="text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
