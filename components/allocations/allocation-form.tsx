"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { allocationSchema, AllocationFormValues } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Client, Asset } from "@/types";
import { useCreateAllocation } from "@/lib/data";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AllocationFormProps {
  clients: Client[];
  assets: Asset[];
  onSuccess?: () => void;
  preselectedClientId?: string;
  preselectedAssetId?: string;
}

export function AllocationForm({
  clients,
  assets,
  onSuccess,
  preselectedClientId,
  preselectedAssetId
}: AllocationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createAllocation = useCreateAllocation();

  // Filter active clients first
  const activeClients = clients.filter(client => client.status === "active");

  const form = useForm<AllocationFormValues>({
    resolver: zodResolver(allocationSchema),
    defaultValues: {
      clienteId: preselectedClientId ? Number(preselectedClientId) : undefined,
      ativoId: preselectedAssetId ? Number(preselectedAssetId) : undefined,
      quantidade: 0,
    },
  });

  async function onSubmit(data: AllocationFormValues) {
    setIsSubmitting(true);

    try {
      await createAllocation.mutateAsync(data);
      toast.success("Allocation created successfully");
      form.reset({ 
        clienteId: data.clienteId, 
        ativoId: 0, 
        quantidade: 0 
      });
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to create allocation");
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedAssetId = form.watch("ativoId");
  // adicionado Number para garantir que o ID seja um número - retornar
  const selectedAsset = assets.find(asset => Number(asset.id) === selectedAssetId);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="clienteId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value?.toString()}
                disabled={!!preselectedClientId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {activeClients.map(client => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ativoId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asset</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value?.toString()}
                disabled={!!preselectedAssetId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {assets.map(asset => (
                    <SelectItem key={asset.id} value={asset.id.toString()}>
                      {asset.nome} (${asset.valor.toLocaleString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantidade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-8"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </div>
              </FormControl>
              {selectedAsset && (
                <p className="text-sm text-muted-foreground">
                  Asset value: ${selectedAsset.valor.toLocaleString()}
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Allocation
        </Button>
      </form>
    </Form>
  );
}