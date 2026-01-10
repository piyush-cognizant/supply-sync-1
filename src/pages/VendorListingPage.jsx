import React, { useState, useEffect } from "react";
import vendorService from "@/services/vendor.service";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import VendorCardItem from "@/components/admin/vendor/VendorCardItem";
import CreateVendorDialog from "@/components/admin/vendor/CreateVendorDialog";
import { useNavigate } from "react-router";
import { VENDOR_STATUS } from "@/constants/entities";
import { HugeiconsIcon } from "@hugeicons/react";
import { PreferenceHorizontalIcon } from "@hugeicons/core-free-icons";

const VendorListingPage = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const navigate = useNavigate();

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await vendorService.getAll();
      if (response.success && Array.isArray(response.data)) {
        setVendors(response.data);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = statusFilter === "ALL" 
    ? vendors 
    : vendors.filter(vendor => vendor.status === statusFilter);

  return (
    <div className="w-full py-6 space-y-6">
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
            <BreadcrumbPage>Manage Vendors</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Vendors</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all your vendors in the supply chain.
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="gap-2"
        >
          + Create Vendor
        </Button>
      </div>

      {/* Filter Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={PreferenceHorizontalIcon} size={20} />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value={VENDOR_STATUS.APPROVED}>Approved</SelectItem>
              <SelectItem value={VENDOR_STATUS.PENDING}>Pending</SelectItem>
              <SelectItem value={VENDOR_STATUS.SUSPENDED}>Suspended</SelectItem>
              <SelectItem value={VENDOR_STATUS.INACTIVE}>Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {statusFilter !== "ALL" && (
          <p className="text-sm text-muted-foreground">
            Showing {filteredVendors.length} vendor(s)
          </p>
        )}
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))
        ) : filteredVendors.length > 0 ? (
          filteredVendors.map((vendor) => (
            <VendorCardItem
              key={vendor.id}
              vendor={vendor}
              onClick={() => navigate(`/admin/manage/vendors/${vendor.id}`)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <p>No vendors found</p>
          </div>
        )}
      </div>

      {/* Create Vendor Dialog */}
      <CreateVendorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onVendorCreated={fetchVendors}
      />
    </div>
  );
};

export default VendorListingPage;
