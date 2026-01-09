import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { Building02Icon, Mail02Icon, PreferenceHorizontalIcon, TelephoneIcon } from "@hugeicons/core-free-icons";
import { VENDOR_STATUS } from "@/constants/entities";

const statusColors = {
  [VENDOR_STATUS.APPROVED]: "bg-green-100 text-green-800",
  [VENDOR_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
  [VENDOR_STATUS.SUSPENDED]: "bg-red-100 text-red-800",
  [VENDOR_STATUS.INACTIVE]: "bg-gray-100 text-gray-800",
};

const VendorCardItem = ({ vendor, onClick }) => {
  const createdDate = new Date(vendor.createdAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 border-0 shadow-sm"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1">
            <div className="p-2.5 bg-blue-100 rounded-lg mt-0.5">
              <HugeiconsIcon icon={Building02Icon} className="text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="line-clamp-2 text-base">{vendor.name}</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">ID: {vendor.id}</p>
            </div>
          </div>
        </div>
        <Badge className={`w-fit ${statusColors[vendor.status]}`}>
          {vendor.status}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Contact Email */}
        <div className="flex items-center gap-2 text-sm">
          <HugeiconsIcon icon={Mail02Icon} className="text-muted-foreground flex-shrink-0" />
          <span className="text-muted-foreground truncate">{vendor.contactEmail}</span>
        </div>

        {/* Contact Phone */}
        <div className="flex items-center gap-2 text-sm">
          <HugeiconsIcon icon={TelephoneIcon} className="text-muted-foreground flex-shrink-0" />
          <span className="text-muted-foreground">{vendor.contactPhone}</span>
        </div>

        {/* Address */}
        {vendor.address && (
          <div className="flex items-start gap-2 text-sm">
            <HugeiconsIcon icon={Building02Icon} className="text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="text-muted-foreground text-xs">
              <p>{vendor.address.street}</p>
              <p>{vendor.address.city}, {vendor.address.state} {vendor.address.zipCode}</p>
              <p>{vendor.address.country}</p>
            </div>
          </div>
        )}

        {/* User ID and Created Date */}
        <div className="pt-2 border-t space-y-1">
          {vendor.userId && (
            <p className="text-xs text-muted-foreground">
              User ID: <span className="font-medium text-foreground">{vendor.userId}</span>
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Created: <span className="font-medium text-foreground">{createdDate}</span>
          </p>
        </div>

        {/* Click Hint */}
        <p className="text-xs text-primary/60 pt-1">Click to view details</p>
      </CardContent>
    </Card>
  );
};

export default VendorCardItem;