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
import { format } from "date-fns";
import { MoreHorizontal, Trash2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface ExtendedAllocation extends Allocation {
  client: Client;
  asset: Asset;
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
  
  const handleDelete = async (id: string) => {
    try {
      await deleteAllocation.mutateAsync(id);
      toast.success("Allocation deleted successfully");
    } catch (error) {
      toast.error("Failed to delete allocation");
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {showClientColumn && <TableHead>Client</TableHead>}
            {showAssetColumn && <TableHead>Asset</TableHead>}
            <TableHead>Amount</TableHead>
            <TableHead>Percentage</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allocations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showClientColumn && showAssetColumn ? 6 : 5} className="text-center h-24 text-muted-foreground">
                No allocations found.
              </TableCell>
            </TableRow>
          ) : (
            allocations.map((allocation) => (
              <TableRow key={allocation.id}>
                {showClientColumn && (
                  <TableCell>
                    <Link href={`/clients/${allocation.client.id}`} className="font-medium hover:underline">
                      {allocation.client.name}
                    </Link>
                    {allocation.client.status === "inactive" && (
                      <span className="ml-2 inline-flex items-center">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      </span>
                    )}
                  </TableCell>
                )}
                {showAssetColumn && (
                  <TableCell>
                    <Link href={`/assets/${allocation.asset.id}`} className="hover:underline">
                      {allocation.clientId}
                    </Link>
                  </TableCell>
                )}
                <TableCell>
                  {formatCurrency(allocation.amount)}
                </TableCell>
                <TableCell>
                  {allocation.percentage.toFixed(2)}%
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(allocation.createdAt), "MMM d, yyyy")}
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
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(allocation.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
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