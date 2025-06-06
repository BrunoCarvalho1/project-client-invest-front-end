"use client";

import { useAsset, useClients } from "@/lib/data";
import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AllocationsTable } from "@/components/allocations/allocations-table";
import { AllocationForm } from "@/components/allocations/allocation-form";
import { Loader2, ArrowLeft, Edit, PlusCircle, PieChart as PieChartIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AssetDetailsPage() {
  const params = useParams();
  const assetId = params?.id as string;
  const [open, setOpen] = useState(false);

  const { data: asset, isLoading: isAssetLoading } = useAsset(assetId);
  const { data: clients, isLoading: isClientsLoading } = useClients();

  const isLoading = isAssetLoading || isClientsLoading;

  // ✅ 1. LÓGICA DE PREPARAÇÃO DOS DADOS CORRIGIDA
  // Usamos useMemo para evitar recálculos desnecessários a cada renderização
  const { totalAllocated, chartData, tableAllocations } = useMemo(() => {
    const allocations = asset?.allocations || [];
    const clientList = clients || [];

    // Calcula o total alocado somando as quantidades
    const total = allocations.reduce((sum: any, alloc: { quantidade: any; }) => sum + (alloc.quantidade || 0), 0);

    // Prepara os dados para o gráfico de pizza
    const chart = allocations.map((alloc: { clientId: any; quantidade: any; }) => {
      const client = clientList.find((c: { id: any; }) => c.id === alloc.clientId);
      return {
        name: client?.name || 'Cliente desconhecido',
        value: alloc.quantidade || 0,
      };
    });

    // Prepara os dados para a tabela, garantindo que o formato esteja correto
    const tableData = allocations.map((alloc: { clientId: any; }) => {
      const clientData = clientList.find((c: { id: any; }) => c.id === alloc.clientId);
      return {
        ...alloc,
        ativo: asset,      // Usa o objeto 'asset' completo da página
        cliente: clientData, // Adiciona o objeto 'cliente' completo
      };
    });

    return { totalAllocated: total, chartData: chart, tableAllocations: tableData };

  }, [asset, clients]);


  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Carregando detalhes do ativo...</p>
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md">
          Ativo não encontrado
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };
  
  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
  const activeClients = clients?.filter((client: { status: string; }) => client.status === "active") || [];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild className="h-8 w-8">
          <Link href="/assets">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <DashboardHeader
          title={asset.nome} // Corrigido para 'nome'
          description={`Detalhes e alocações do ativo`}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Detalhes do Ativo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Valor Atual</div>
              {/* ✅ 2. CORRIGIDO PARA USAR O CAMPO 'valor' DO ATIVO */}
              <div className="text-xl font-bold">{formatCurrency(asset.valor)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Total Alocado</div>
              {/* ✅ 3. CORRIGIDO PARA USAR A VARIÁVEL CALCULADA */}
              <div className="text-xl font-bold">{formatCurrency(totalAllocated)}</div>
            </div>
            <div className="pt-2">
              <Button variant="outline" asChild className="w-full">
                <Link href={`/assets/${asset.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Ativo
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">Alocação por Cliente</CardTitle>
            <CardDescription>
              Distribuição deste ativo entre os clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <PieChartIcon className="h-12 w-12 mb-2 opacity-40" />
                <p>Ainda não há alocações</p>
                <Button variant="outline" className="mt-4" onClick={() => setOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Adicionar primeira alocação
                </Button>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={chartData} // ✅ 4. USANDO OS DADOS CORRIGIDOS PARA O GRÁFICO
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
                    formatter={(value: number) => [formatCurrency(value), "Valor Alocado"]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="allocations" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="allocations">Alocações</TabsTrigger>
          </TabsList>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar Alocação
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Alocação de Cliente</DialogTitle>
                <DialogDescription>
                  Aloque {asset.nome} para um cliente.
                </DialogDescription>
              </DialogHeader>
              {clients && (
                <AllocationForm 
                  clients={activeClients} 
                  assets={[asset]} 
                  onSuccess={() => setOpen(false)}
                  preselectedAssetId={String(asset.id)}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
        
        <TabsContent value="allocations" className="space-y-4">
          <AllocationsTable 
            allocations={tableAllocations} // ✅ 5. USANDO OS DADOS CORRIGIDOS PARA A TABELA
            showAssetColumn={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}