"use client";

import { useState } from "react";
import { useAssets } from "@/lib/data";
import { DashboardHeader } from "@/components/dashboard-header";
import { AssetsTable } from "@/components/assets/assets-table";
import { AssetForm } from "@/components/assets/asset-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, Loader2 } from "lucide-react";

export default function AssetsPage() {
  const [open, setOpen] = useState(false);
  const { data: assets, isLoading, error } = useAssets();
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading assets...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md">
          Error loading assets
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <DashboardHeader
          title="Assets"
          description="Manage your investment assets."
        />
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Asset</DialogTitle>
              <DialogDescription>
                Create a new asset record. Fill out the asset details below.
              </DialogDescription>
            </DialogHeader>
            <AssetForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      <AssetsTable assets={assets || []} />
    </div>
  );
}