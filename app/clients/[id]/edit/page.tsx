"use client";

import { useClient } from "@/lib/data";
import { DashboardHeader } from "@/components/dashboard-header";
import { ClientForm } from "@/components/clients/client-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

// Add this export for static site generation
// export async function generateStaticParams() {
//   // In a real app, this would fetch from your API
//   // For now, return an empty array since we're using client-side data
//   return [];
// }

export default function EditClientPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params?.id as string;
  
  const { data: client, isLoading } = useClient(clientId);
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading client...</p>
        </div>
      </div>
    );
  }
  
  if (!client) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md">
          Client not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild className="h-8 w-8">
          <Link href={`/clients/${client.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <DashboardHeader
          title={`Edit Client: ${client.name}`}
          description="Update client information"
        />
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Client</CardTitle>
          <CardDescription>
            Make changes to the client information below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClientForm 
            client={client} 
            onSuccess={() => router.push(`/clients/${client.id}`)} 
          />
        </CardContent>
      </Card>
    </div>
  );
}