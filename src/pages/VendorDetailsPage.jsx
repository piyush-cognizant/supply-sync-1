import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import vendorService from "@/services/vendor.service";
import vendorDocumentService from "@/services/vendor-document.service";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Building02Icon,
  Mail02Icon,
  Telephone,
  Tick02Icon,
  SecurityCheckIcon,
  Download02Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { VENDOR_STATUS } from "@/constants/entities";

const statusColors = {
  [VENDOR_STATUS.APPROVED]: "bg-success/20 text-success",
  [VENDOR_STATUS.PENDING]: "bg-warning/20 text-warning",
  [VENDOR_STATUS.SUSPENDED]: "bg-destructive/20 text-destructive",
  [VENDOR_STATUS.INACTIVE]: "bg-muted text-muted-foreground",
};

const VendorDetailsPage = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    fetchVendorDetails();
  }, [vendorId]);

  const fetchVendorDetails = async () => {
    try {
      setLoading(true);
      console.log("Fetching vendor with ID:", vendorId);
      const vendorResponse = await vendorService.getById(vendorId);
      console.log("Vendor response:", vendorResponse);
      
      if (vendorResponse.success && vendorResponse.data) {
        console.log("Vendor data:", vendorResponse.data);
        setVendor(vendorResponse.data);
        setSelectedStatus(vendorResponse.data.status);
      } else {
        console.log("Vendor response not successful or no data:", vendorResponse);
        toast.error("Failed to fetch vendor details");
      }

      // Fetch vendor documents
      const documentsResponse = await vendorDocumentService.getAll();
      if (documentsResponse.success) {
        const vendorDocs = documentsResponse.data.filter(doc => doc.vendorId === vendorId);
        setDocuments(vendorDocs);
      }
    } catch (error) {
      console.error("Error fetching vendor details:", error);
      toast.error("An error occurred while fetching vendor details");
    } finally {
      setLoading(false);
    }
  };

  const canApproveVendor = () => {
    if (!vendor) return false;
    
    // Check if all required details are filled
    const hasAllDetails =
      vendor.name &&
      vendor.contactEmail &&
      vendor.contactPhone &&
      vendor.address?.street &&
      vendor.address?.city &&
      vendor.address?.state &&
      vendor.address?.zipCode &&
      vendor.address?.country;

    // Check if there are vendor documents
    const hasDocuments = documents.length > 0;

    return hasAllDetails && hasDocuments;
  };

  const handleStatusChange = async (newStatus) => {
    if (newStatus === VENDOR_STATUS.APPROVED && !canApproveVendor()) {
      toast.error("Cannot approve vendor. Missing documents or complete address details.");
      return;
    }

    try {
      setUpdatingStatus(true);
      const updateResponse = await vendorService.update(vendorId, {
        ...vendor,
        status: newStatus,
      });

      if (updateResponse.success) {
        setVendor({ ...vendor, status: newStatus });
        setSelectedStatus(newStatus);
        toast.success(`Vendor status updated to ${newStatus}`);
      } else {
        toast.error("Failed to update vendor status");
      }
    } catch (error) {
      console.error("Error updating vendor status:", error);
      toast.error("An error occurred while updating vendor status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const createdDate = vendor
    ? new Date(vendor.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  const handleDocumentClick = (docUrl) => {
    if (docUrl) {
      window.open(docUrl, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="w-full p-6 space-y-6">
        <Skeleton className="h-12 w-80" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="w-full p-6 text-center py-12">
        <p className="text-muted-foreground">Vendor not found</p>
        <Button onClick={() => navigate("/admin/manage/vendors")} className="mt-4">
          Back to Vendors
        </Button>
      </div>
    );
  }

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
            <BreadcrumbLink onClick={() => navigate("/admin/manage/vendors")} className="cursor-pointer">
              Manage Vendors
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{vendor.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{vendor.name}</h1>
          <p className="text-muted-foreground mt-2">View and manage vendor details and compliance documents</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details Card */}
        <div className="lg:col-span-2"> 
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Vendor Information</CardTitle>
              <CardDescription>Complete vendor profile and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Vendor ID</p>
                  <p className="text-sm font-semibold mt-1">{vendor.id}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">User ID</p>
                  <p className="text-sm font-semibold mt-1">{vendor.userId}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Created Date</p>
                  <p className="text-sm font-semibold mt-1">{createdDate}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Status</p>
                  <Badge className={`w-fit mt-1 ${statusColors[vendor.status]}`}>
                    {vendor.status}
                  </Badge>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Contact Information</h3>
                <div className="space-y-3">
                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <HugeiconsIcon icon={Mail02Icon} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium truncate">{vendor.contactEmail}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <HugeiconsIcon icon={Telephone} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{vendor.contactPhone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              {vendor.address && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Address Details</h3>
                  <div className="bg-secondary rounded-lg p-4 space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Street:</span> {vendor.address.street || "N/A"}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">City:</span> {vendor.address.city || "N/A"}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">State:</span> {vendor.address.state || "N/A"}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Zip Code:</span> {vendor.address.zipCode || "N/A"}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Country:</span> {vendor.address.country || "N/A"}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Status & Documents */}
        <div className="space-y-4">
          {/* Status Update Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Update Status</CardTitle>
              <CardDescription>Change vendor approval status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedStatus} onValueChange={handleStatusChange} disabled={updatingStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={VENDOR_STATUS.PENDING}>Pending</SelectItem>
                  <SelectItem
                    value={VENDOR_STATUS.APPROVED}
                    disabled={!canApproveVendor()}
                  >
                    Approved
                  </SelectItem>
                  <SelectItem value={VENDOR_STATUS.SUSPENDED}>Suspended</SelectItem>
                  <SelectItem value={VENDOR_STATUS.INACTIVE}>Inactive</SelectItem>
                </SelectContent>
              </Select>

              {selectedStatus === VENDOR_STATUS.PENDING && !canApproveVendor() && (
                <div className="bg-warning/20 border border-warning/30 rounded-lg p-3">
                  <p className="text-xs text-warning">
                    <span className="font-semibold">Note:</span> To approve this vendor, ensure:
                  </p>
                  <ul className="text-xs text-warning mt-2 space-y-1 ml-3">
                    <li>✓ All address details are filled</li>
                    <li>✓ At least one compliance document is uploaded</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Compliance Documents Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <HugeiconsIcon icon={Tick02Icon} size={20} className="text-primary" />
                Compliance Documents
              </CardTitle>
              <CardDescription>{documents.length} document(s)</CardDescription>
            </CardHeader>
            <CardContent>
              {documents.length > 0 ? (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => handleDocumentClick(doc.url)}
                      className="flex items-center justify-between p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors cursor-pointer group"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && handleDocumentClick(doc.url)}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <HugeiconsIcon icon={Tick02Icon} className="text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{doc.documentName}</p>
                          <p className="text-xs text-muted-foreground">{doc.documentType}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {doc.verified && (
                          <HugeiconsIcon icon={SecurityCheckIcon} className="text-success flex-shrink-0" />
                        )}
                        <HugeiconsIcon icon={Download02Icon} className="text-muted-foreground group-hover:text-primary flex-shrink-0 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <HugeiconsIcon icon={Tick02Icon} size={32} className="text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No compliance documents uploaded yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VendorDetailsPage;
