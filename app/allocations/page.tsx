"use client";

import { useState } from "react";
import { useAllocations, useClients, useAssets } from "@/lib/data";
import { DashboardHeader } from "@/components/dashboard-header";
import { AllocationsTable } from "@/components/allocations/allocations-table";
import { AllocationForm } from "@/components/allocations/allocation-form";
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

export default function AllocationsPage() {
  const [open, setOpen] = useState(false);
  const { data: allocations, isLoading: isAllocationsLoading } = useAllocations();
  const { data: clients, isLoading: isClientsLoading } = useClients();
  const { data: assets, isLoading: isAssetsLoading } = useAssets();
  
  const isLoading = isAllocationsLoading || isClientsLoading || isAssetsLoading;
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading allocations...</p>
        </div>
      </div>
    );
  }
  
  // Filter only active clients
  const activeClients = clients?.filter(client => client.status === "active") || [];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <DashboardHeader
          title="Allocations"
          description="Manage client asset allocations."
        />
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Allocation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Asset Allocation</DialogTitle>
              <DialogDescription>
                Create a new asset allocation for a client.
              </DialogDescription>
            </DialogHeader>
            {activeClients && assets && (
              <AllocationForm 
                clients={activeClients} 
                assets={assets} 
                onSuccess={() => setOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
      
      {allocations && <AllocationsTable allocations={allocations} />}
    </div>
  );
}