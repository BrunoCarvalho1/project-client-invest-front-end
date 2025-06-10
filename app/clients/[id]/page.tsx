"use client";

import { useClient, useAssets } from "@/lib/data";
import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AllocationsTable } from "@/components/allocations/allocations-table";
import { AllocationForm } from "@/components/allocations/allocation-form";
import { Loader2, ArrowLeft, UserCog, CheckCircle, XCircle, PieChart, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { PieChart as RechartsChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ClientDetailsPage() {
  const params = useParams();
  const clientId = params?.id as string;
  const [open, setOpen] = useState(false);

  const { data: client, isLoading: isClientLoading } = useClient(clientId);
  const { data: assets, isLoading: isAssetsLoading } = useAssets();


  const isLoading = isClientLoading || isAssetsLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading client details...</p>
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

  const chartData = client.allocations?.map((allocation: { asset: { name: any; }; amount: any; }) => ({
    name: allocation.asset?.name || 'Unknown Asset',
    value: allocation.amount || 0,
  })) || [];

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  const formatCurrency = (value: number | undefined | null) => {
    const num = Number(value || 0);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild className="h-8 w-8">
          <Link href="/clients">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <DashboardHeader
          title={client.name}
          description={client.email}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Client Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Status</div>
              <div>
                <Badge variant={client.status === "active" ? "default" : "outline"}>
                  {client.status === "active" ? (
                    <CheckCircle className="h-3.5 w-3.5 mr-1" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 mr-1" />
                  )}
                  {client.status}
                </Badge>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Created on</div>
              <div>{format(new Date(client.createdAt), "MMMM d, yyyy")}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Total Allocated</div>
              <div className="text-xl font-bold">
                {formatCurrency(client.totalAllocated)}
              </div>
            </div>
            <div className="pt-2">
              <Button variant="outline" asChild className="w-full">
                <Link href={`/clients/${client.id}/edit`}>
                  <UserCog className="h-4 w-4 mr-2" />
                  Edit Client
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">Asset Allocation</CardTitle>
            <CardDescription>
              Distribution of investments across different assets
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? ( 
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <PieChart className="h-12 w-12 mb-2 opacity-40" />
                <p>No allocations yet</p>
                <Button variant="outline" className="mt-4" onClick={() => setOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add First Allocation
                </Button>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <RechartsChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                    animationDuration={750}
                  >
                    {chartData.map((entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), "Amount"]}
                  />
                  <Legend />
                </RechartsChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="allocations" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="allocations">Allocations</TabsTrigger>
          </TabsList>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Allocation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Asset Allocation</DialogTitle>
                <DialogDescription>
                  Allocate assets to {client.name}. This will create a new allocation record.
                </DialogDescription>
              </DialogHeader>
              {assets && (
                <AllocationForm
                  clients={[client]}
                  assets={assets}
                  onSuccess={() => setOpen(false)}
                  preselectedClientId={client.id}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="allocations" className="space-y-4">
          <AllocationsTable
            allocations={(client.alocacoes || []).map((alocacao: any) => ({
              ...alocacao,
              cliente: client 
            }))}
            showClientColumn={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}