import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HugeiconsIcon } from "@hugeicons/react";
import { Copy02Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createVendorSchema } from "@/lib/schemas/createVendor.schema";
import { generateCredentials, copyToClipboard } from "@/lib/utils";
import userService from "@/services/user.service";
import vendorService from "@/services/vendor.service";
import { Skeleton } from "@/components/ui/skeleton";

const CreateVendorDialog = ({ open, onOpenChange, onVendorCreated }) => {
  const [credentials, setCredentials] = useState(null);
  const [isGeneratingPassword, setIsGeneratingPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(createVendorSchema),
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

  const watchEmail = watch("contactEmail");

  const handleGeneratePassword = () => {
    if (!watchEmail) {
      toast.error("Please enter email first");
      return;
    }

    setIsGeneratingPassword(true);
    setTimeout(() => {
      const creds = generateCredentials(watchEmail);
      setCredentials(creds);
      setIsGeneratingPassword(false);
      toast.success("Credentials generated");
    }, 300);
  };

  const handleCopyCredentials = async () => {
    if (!credentials) return;
    const text = `Email: ${credentials.email}\nPassword: ${credentials.password}`;
    const success = await copyToClipboard(text);
    if (success) {
      toast.success("Credentials copied to clipboard");
    } else {
      toast.error("Failed to copy credentials");
    }
  };

  const onSubmit = async (data) => {
    if (!credentials) {
      toast.error("Please generate password first");
      return;
    }

    try {
      setIsCreating(true);

      // Step 1: Create user
      const userPayload = {
        email: credentials.email,
        password: credentials.password,
        role: "VENDOR",
      };

      const userResponse = await userService.create(userPayload);

      if (!userResponse.success) {
        toast.error(userResponse.message || "Failed to create user");
        return;
      }

      const userId = userResponse.data.id;

      // Step 2: Create vendor with PENDING status
      const vendorPayload = {
        userId,
        name: data.name,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        address: data.address,
        status: "PENDING",
      };

      const vendorResponse = await vendorService.create(vendorPayload);

      if (!vendorResponse.success) {
        toast.error(vendorResponse.message || "Failed to create vendor");
        return;
      }

      toast.success("Vendor created successfully with PENDING status");
      reset();
      setCredentials(null);
      onOpenChange(false);
      onVendorCreated?.();
    } catch (error) {
      console.error("Error creating vendor:", error);
      toast.error("An error occurred while creating vendor");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Vendor</DialogTitle>
          <DialogDescription>Fill in the vendor details and generate credentials</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Basic Information</h3>

            <div>
              <Label htmlFor="name">Vendor Name *</Label>
              <Input
                id="name"
                placeholder="e.g., SteelCo Pvt Ltd"
                {...register("name")}
                className="mt-1.5"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="contactEmail">Contact Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="e.g., contact@vendor.com"
                {...register("contactEmail")}
                className="mt-1.5"
              />
              {errors.contactEmail && (
                <p className="text-xs text-red-500 mt-1">{errors.contactEmail.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="contactPhone">Contact Phone *</Label>
              <Input
                id="contactPhone"
                placeholder="e.g., 9876543210"
                {...register("contactPhone")}
                className="mt-1.5"
              />
              {errors.contactPhone && (
                <p className="text-xs text-red-500 mt-1">{errors.contactPhone.message}</p>
              )}
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Address</h3>
              <span className="text-xs text-muted-foreground">(Optional - can be updated during approval)</span>
            </div>

            <div>
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                placeholder="e.g., 123 Industrial Area"
                {...register("address.street")}
                className="mt-1.5"
              />
              {errors.address?.street && (
                <p className="text-xs text-red-500 mt-1">{errors.address.street.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="e.g., Mumbai"
                  {...register("address.city")}
                  className="mt-1.5"
                />
                {errors.address?.city && (
                  <p className="text-xs text-red-500 mt-1">{errors.address.city.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="e.g., Maharashtra"
                  {...register("address.state")}
                  className="mt-1.5"
                />
                {errors.address?.state && (
                  <p className="text-xs text-red-500 mt-1">{errors.address.state.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  placeholder="e.g., 400001"
                  {...register("address.zipCode")}
                  className="mt-1.5"
                />
                {errors.address?.zipCode && (
                  <p className="text-xs text-red-500 mt-1">{errors.address.zipCode.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  placeholder="e.g., India"
                  {...register("address.country")}
                  className="mt-1.5"
                />
                {errors.address?.country && (
                  <p className="text-xs text-red-500 mt-1">{errors.address.country.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Credentials Generation */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Credentials</h3>
              <Button
                type="button"
                onClick={handleGeneratePassword}
                disabled={!watchEmail || isGeneratingPassword}
                variant="outline"
                size="sm"
              >
                {isGeneratingPassword ? "Generating..." : "Generate Password"}
              </Button>
            </div>

            {credentials ? (
              <Card className="border-0 bg-muted">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span>Generated Credentials</span>
                    <Button
                      type="button"
                      onClick={handleCopyCredentials}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <HugeiconsIcon icon={Copy02Icon} />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-mono text-foreground">{credentials.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Password</p>
                    <p className="font-mono text-foreground">{credentials.password}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="p-4 border border-dashed rounded-lg text-center text-sm text-muted-foreground">
                Generate password to see credentials
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setCredentials(null);
                onOpenChange(false);
              }}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || !credentials}>
              {isCreating ? "Creating..." : "Create Vendor"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateVendorDialog;
