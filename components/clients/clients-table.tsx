"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Client } from "@/types";
import { useUpdateClientStatus } from "@/lib/data";
import { format } from "date-fns";
import { MoreHorizontal, Edit, Eye, CheckCircle, XCircle, Search } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface ClientsTableProps {
  clients: Client[];
}

export function ClientsTable({ clients }: ClientsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const updateClientStatus = useUpdateClientStatus();
  
const filteredClients = clients.filter(client => {
  const name = client.name || ''; // Trata null/undefined como string vazia
  const email = client.email || ''; // Trata null/undefined como string vazia
  
  return (
    name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.toLowerCase().includes(searchTerm.toLowerCase())
  );
});
  
  const handleStatusToggle = async (client: Client) => {
    try {
      const newStatus = client.status === "active" ? "inactive" : "active";
      await updateClientStatus.mutateAsync({
        id: client.id,
        status: newStatus,
      });
      toast.success(`Client status changed to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update client status");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  No clients found.
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>
                    <Badge variant={client.status === "active" ? "default" : "outline"}>
                      {client.status === "active" ? (
                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 mr-1" />
                      )}
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(client.createdAt), "MMM d, yyyy")}
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
                        <DropdownMenuItem asChild>
                          <Link href={`/clients/${client.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/clients/${client.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleStatusToggle(client)}>
                          {client.status === "active" ? (
                            <>
                              <XCircle className="h-4 w-4 mr-2" />
                              Set as Inactive
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Set as Active
                            </>
                          )}
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
    </div>
  );
}