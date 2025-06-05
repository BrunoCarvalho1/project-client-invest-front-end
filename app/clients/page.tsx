"use client";

import { useState } from "react";
import { useClients } from "@/lib/data";
import { DashboardHeader } from "@/components/dashboard-header";
import { ClientsTable } from "@/components/clients/clients-table";
import { ClientForm } from "@/components/clients/client-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus, Loader2 } from "lucide-react";

export default function ClientsPage() {
  const [open, setOpen] = useState(false);
  const { data: clients, isLoading, error } = useClients();
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading clients...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md">
          Error loading clients
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <DashboardHeader
          title="Clients"
          description="Manage your investment clients."
        />
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Create a new client record. Fill out the client's details below.
              </DialogDescription>
            </DialogHeader>
            <ClientForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      <ClientsTable clients={clients || []} />
    </div>
  );
}