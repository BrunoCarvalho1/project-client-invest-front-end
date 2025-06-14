"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Allocation, Client, Asset } from "@/types";
import { useDeleteAllocation } from "@/lib/data";
import { MoreHorizontal, Trash2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ReactNode } from "react";

interface ExtendedAllocation extends Allocation {
  quantidade: ReactNode;
  cliente: Client;
  ativo: Asset;
}

interface AllocationsTableProps {
  allocations: ExtendedAllocation[];
  showClientColumn?: boolean;
  showAssetColumn?: boolean;
}

export function AllocationsTable({
  allocations,
  showClientColumn = true,
  showAssetColumn = true,
}: AllocationsTableProps) {
  const deleteAllocation = useDeleteAllocation();

  const validAllocations = allocations.filter(
    allocation => allocation.cliente && allocation.ativo
  );

  const handleDelete = async (id: string | number) => {
    try {
      await deleteAllocation.mutateAsync(String(id));
      toast.success("Alocação deletada com sucesso");
    } catch (error) {
      toast.error("Falha ao deletar alocação");
    }
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (typeof value !== 'number') return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="rounded-md border">
      {allocations.length !== validAllocations.length && (
        <div className="text-sm text-amber-600 p-2 bg-amber-50 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span>
            Aviso: {allocations.length - validAllocations.length} alocações estão com dados de cliente ou ativo ausentes.
          </span>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {showClientColumn && <TableHead>Cliente</TableHead>}
            {showAssetColumn && <TableHead>Ativo</TableHead>}
            <TableHead>Quantidade</TableHead>
            <TableHead>Valor do Ativo</TableHead>
            <TableHead className="w-[50px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {validAllocations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                {allocations.length === 0 ? "Nenhuma alocação encontrada." : "Nenhuma alocação válida para exibir."}
              </TableCell>
            </TableRow>
          ) : (
            validAllocations.map((allocation) => (
              <TableRow key={allocation.id}>
                {showClientColumn && (
                  <TableCell>
                    <Link href={`/clients/${allocation.cliente.id}`} className="font-medium hover:underline">
                      {allocation.cliente.name}
                    </Link>
                    {allocation.cliente.status === "inactive" && (
                      <span className="ml-2 inline-flex items-center" title="Cliente inativo">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      </span>
                    )}
                  </TableCell>
                )}
                {showAssetColumn && (
                  <TableCell>
                    <Link href={`/assets/${allocation.ativo.id}`} className="hover:underline">
                      {allocation.ativo.nome}
                    </Link>
                  </TableCell>
                )}
                <TableCell>{allocation.quantidade}</TableCell>
                <TableCell>{formatCurrency(allocation.ativo.valor)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleDelete(allocation.id)} className="text-destructive focus:text-red-600 cursor-pointer">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Deletar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}