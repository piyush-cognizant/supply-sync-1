import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateVendorSchema } from "@/lib/schemas/updateVendor.schema";
import useAuthStore from "@/store/auth.store";
import vendorService from "@/services/vendor.service";
import vendorDocumentService from "@/services/vendor-document.service";
import fileUploadService from "@/services/file-upload.service";
import { getCurrentUTC } from "@/lib/date-time";
import { formatDate } from "@/lib/date-time";
import { 
  VENDOR_STATUS, 
  DOCUMENT_TYPE, 
  DOCUMENT_TYPE_LABELS 
} from "@/constants/entities";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  Upload01Icon,
  Delete02Icon,
  File02Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  ViewIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";

const STATUS_COLORS = {
  [VENDOR_STATUS.APPROVED]: "bg-green-100 text-green-800",
  [VENDOR_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
  [VENDOR_STATUS.SUSPENDED]: "bg-red-100 text-red-800",
  [VENDOR_STATUS.INACTIVE]: "bg-gray-100 text-gray-800",
};

const VendorProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [vendor, setVendor] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(updateVendorSchema),
    defaultValues: {
      name: "",
      contactEmail: "",
      contactPhone: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
    },
  });

  useEffect(() => {
    if (user?.vendorId) {
      fetchVendorData();
    }
  }, [user?.vendorId]);

  const fetchVendorData = async () => {
    try {
      setLoading(true);
      const [vendorRes, docsRes] = await Promise.all([
        vendorService.getById(user.vendorId),
        vendorDocumentService.getByVendorId(user.vendorId),
      ]);

      if (vendorRes.success && vendorRes.data) {
        setVendor(vendorRes.data);
        reset({
          name: vendorRes.data.name || "",
          contactEmail: vendorRes.data.contactEmail || "",
          contactPhone: vendorRes.data.contactPhone || "",
          address: {
            street: vendorRes.data.address?.street || "",
            city: vendorRes.data.address?.city || "",
            state: vendorRes.data.address?.state || "",
            zipCode: vendorRes.data.address?.zipCode || "",
            country: vendorRes.data.address?.country || "",
          },
        });
      }

      if (docsRes.success) {
        setDocuments(docsRes.data || []);
      }
    } catch (error) {
      console.error("Error fetching vendor data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      
      // When updating profile, set status to PENDING for re-approval
      const updateData = {
        ...vendor,
        ...data,
        status: VENDOR_STATUS.PENDING,
      };

      const response = await vendorService.update(vendor.id, updateData);
      
      if (response.success) {
        setVendor(response.data);
        reset(data);
        toast.success("Profile updated successfully. Your status is now pending approval.");
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating profile");
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Only PDF files are allowed");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setSelectedFile(file);
      if (!documentName) {
        setDocumentName(file.name.replace(".pdf", ""));
      }
    }
  };

  const handleUploadDocument = async () => {
    if (!selectedFile || !documentName || !documentType) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setUploading(true);

      // Upload file (mock)
      const uploadResult = await fileUploadService.upload(selectedFile);
      
      if (!uploadResult.success) {
        toast.error("Failed to upload file");
        return;
      }

      // Create document record
      const documentData = {
        vendorId: vendor.id,
        documentName,
        documentType,
        url: uploadResult.url,
        fileName: uploadResult.fileName,
        fileType: uploadResult.fileType,
        verified: false,
        uploadedAt: getCurrentUTC(),
        verifiedAt: null,
      };

      const response = await vendorDocumentService.create(documentData);
      
      if (response.success) {
        setDocuments([...documents, response.data]);
        
        // Update vendor status to pending when uploading new document
        await vendorService.update(vendor.id, {
          ...vendor,
          status: VENDOR_STATUS.PENDING,
        });
        setVendor({ ...vendor, status: VENDOR_STATUS.PENDING });
        
        toast.success("Document uploaded successfully. Status updated to pending.");
        handleCloseUploadDialog();
      } else {
        toast.error(response.message || "Failed to save document");
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("An error occurred while uploading document");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;

    try {
      const response = await vendorDocumentService.delete(documentToDelete.id);
      
      if (response.success) {
        setDocuments(documents.filter((d) => d.id !== documentToDelete.id));
        toast.success("Document deleted successfully");
      } else {
        toast.error(response.message || "Failed to delete document");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("An error occurred while deleting document");
    } finally {
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  const handleCloseUploadDialog = () => {
    setUploadDialogOpen(false);
    setSelectedFile(null);
    setDocumentName("");
    setDocumentType("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getStatusBadge = (status) => {
    const colorClass = STATUS_COLORS[status] || "bg-gray-100 text-gray-800";
    return <Badge className={colorClass}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-96" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate("/vendor")} className="cursor-pointer">
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Profile</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your vendor profile and compliance documents.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          {getStatusBadge(vendor?.status)}
        </div>
      </div>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={UserIcon} size={20} />
            Vendor Information
          </CardTitle>
          <CardDescription>
            Update your business details. Note: Any changes will require re-approval.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Business Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Business Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Enter business name"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* Contact Email */}
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  {...register("contactEmail")}
                  placeholder="Enter contact email"
                />
                {errors.contactEmail && (
                  <p className="text-sm text-destructive">{errors.contactEmail.message}</p>
                )}
              </div>

              {/* Contact Phone */}
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone *</Label>
                <Input
                  id="contactPhone"
                  {...register("contactPhone")}
                  placeholder="Enter phone number"
                />
                {errors.contactPhone && (
                  <p className="text-sm text-destructive">{errors.contactPhone.message}</p>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-4">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Street */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    {...register("address.street")}
                    placeholder="Enter street address"
                  />
                  {errors.address?.street && (
                    <p className="text-sm text-destructive">{errors.address.street.message}</p>
                  )}
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    {...register("address.city")}
                    placeholder="Enter city"
                  />
                  {errors.address?.city && (
                    <p className="text-sm text-destructive">{errors.address.city.message}</p>
                  )}
                </div>

                {/* State */}
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    {...register("address.state")}
                    placeholder="Enter state"
                  />
                  {errors.address?.state && (
                    <p className="text-sm text-destructive">{errors.address.state.message}</p>
                  )}
                </div>

                {/* Zip Code */}
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input
                    id="zipCode"
                    {...register("address.zipCode")}
                    placeholder="Enter zip code"
                  />
                  {errors.address?.zipCode && (
                    <p className="text-sm text-destructive">{errors.address.zipCode.message}</p>
                  )}
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    {...register("address.country")}
                    placeholder="Enter country"
                  />
                  {errors.address?.country && (
                    <p className="text-sm text-destructive">{errors.address.country.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving || !isDirty}>
                {saving ? "Saving..." : "Update Profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Documents Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={File02Icon} size={20} />
              Compliance Documents
            </CardTitle>
            <CardDescription>
              Upload and manage your compliance and certification documents.
            </CardDescription>
          </div>
          <Button onClick={() => setUploadDialogOpen(true)} className="gap-2">
            <HugeiconsIcon icon={Upload01Icon} size={18} />
            Upload Document
          </Button>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <HugeiconsIcon icon={File02Icon} size={48} className="mb-4 opacity-50" />
              <p className="text-lg">No documents uploaded</p>
              <p className="text-sm">Upload your compliance documents to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.documentName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {DOCUMENT_TYPE_LABELS[doc.documentType] || doc.documentType}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(doc.uploadedAt)}</TableCell>
                    <TableCell>
                      {doc.verified ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
                          <span className="text-sm">Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-yellow-600">
                          <HugeiconsIcon icon={Clock01Icon} size={16} />
                          <span className="text-sm">Pending</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(doc.url, "_blank")}
                          title="View Document"
                        >
                          <HugeiconsIcon icon={ViewIcon} size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setDocumentToDelete(doc);
                            setDeleteDialogOpen(true);
                          }}
                          title="Delete Document"
                          className="text-destructive hover:text-destructive"
                        >
                          <HugeiconsIcon icon={Delete02Icon} size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Upload Document Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a compliance or certification document. Only PDF files up to 5MB are allowed.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Document Name */}
            <div className="space-y-2">
              <Label htmlFor="docName">Document Name *</Label>
              <Input
                id="docName"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="e.g., ISO 9001 Certificate 2026"
              />
            </div>

            {/* Document Type */}
            <div className="space-y-2">
              <Label htmlFor="docType">Document Type *</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DOCUMENT_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="file">Select File *</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-2">
                    <HugeiconsIcon icon={File02Icon} size={24} className="text-primary" />
                    <span className="text-sm font-medium">{selectedFile.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedFile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                    >
                      <HugeiconsIcon icon={Cancel01Icon} size={16} />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <HugeiconsIcon icon={Upload01Icon} size={32} className="mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to select or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PDF only, max 5MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  id="file"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  style={{ position: "relative" }}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseUploadDialog}>
              Cancel
            </Button>
            <Button onClick={handleUploadDocument} disabled={uploading}>
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{documentToDelete?.documentName}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDocument} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VendorProfilePage;
