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
import { Allocation, Client, Asset } from "@/types"; // Supondo que seus tipos básicos estão corretos
import { useDeleteAllocation } from "@/lib/data";
import { format } from "date-fns";
import { MoreHorizontal, Trash2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// Interface ajustada para corresponder aos dados da API
interface ExtendedAllocation extends Allocation {
  cliente: Client; // Alterado de 'client' para 'cliente'
  ativo: Asset;    // Alterado de 'asset' para 'ativo'
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

  // Filtro ajustado para corresponder aos novos nomes de propriedade
  const validAllocations = allocations.filter(
    allocation => allocation.cliente && allocation.ativo
  );

  const handleDelete = async (id: string | number) => { // Aceitar string ou number para o ID
    try {
      await deleteAllocation.mutateAsync(String(id)); // Garantir que o ID seja string
      toast.success("Allocation deleted successfully");
    } catch (error) {
      toast.error("Failed to delete allocation");
    }
  };

  const formatCurrency = (value: number) => {
    // A API retorna 'quantidade: 0', talvez você queira mostrar o valor do ativo?
    // Se a intenção é mostrar a quantidade, o nome 'formatCurrency' pode ser confuso.
    // Por enquanto, vamos manter como está.
    if (typeof value !== 'number') return 'N/A'; // Segurança extra
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  // Supondo que os tipos de Allocation, Client e Asset em /types estejam corretos.
  // Seus dados da API têm 'id' como número, então ajustamos a chamada handleDelete.
  // Seus dados da API têm 'quantidade' e não 'amount' ou 'percentage'.
  // Ajustei o código abaixo para refletir os nomes de propriedade da sua API.

  return (
    <div className="rounded-md border">
      {/* Aviso sobre alocações inválidas */}
      {allocations.length !== validAllocations.length && (
        <div className="text-sm text-amber-600 p-2 bg-amber-50 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>
                Warning: {allocations.length - validAllocations.length} allocations are missing client or asset data.
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
            <TableHead>Criado em</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {validAllocations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showClientColumn && showAssetColumn ? 6 : 5} className="text-center h-24 text-muted-foreground">
                {allocations.length === 0 ? "Nenhuma alocação encontrada." : "Nenhuma alocação válida encontrada (verifique os dados de cliente/ativo)."}
              </TableCell>
            </TableRow>
          ) : (
            validAllocations.map((allocation) => (
              <TableRow key={allocation.id}>
                {showClientColumn && (
                  <TableCell>
                    {/* Verifique se a rota '/clients/' está correta */}
                    <Link href={`/clients/${allocation.cliente!.id}`} className="font-medium hover:underline">
                      {allocation.cliente!.name}
                    </Link>
                    {allocation.cliente!.status === "inactive" && (
                      <span className="ml-2 inline-flex items-center" title="Cliente inativo">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      </span>
                    )}
                  </TableCell>
                )}
                {showAssetColumn && (
                  <TableCell>
                     {/* Verifique se a rota '/assets/' está correta */}
                    <Link href={`/assets/${allocation.ativo!.id}`} className="hover:underline">
                      {allocation.ativo!.nome}
                    </Link>
                  </TableCell>
                )}
                <TableCell>
                  {/* Exibindo o 'valor' que vem dentro do objeto 'ativo' */}
                  {formatCurrency(allocation.ativo.valor)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {/* Se a sua API não retorna 'createdAt' na alocação, você precisará ajustar aqui */}
                  {/* Usando o 'createdAt' do cliente como fallback, se existir */}
                  {allocation.createdAt ? format(new Date(allocation.createdAt), "MMM d, yyyy") : 'N/A'}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(allocation.id)}
                      >
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