"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assetSchema, AssetFormValues } from "@/lib/validation";
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
import { Asset } from "@/types";
import { useCreateAsset, useUpdateAsset } from "@/lib/data";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AssetFormProps {
  asset?: Asset;
  onSuccess?: () => void;
}

export function AssetForm({ asset, onSuccess }: AssetFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditMode = !!asset;
  const createAsset = useCreateAsset();
  const updateAsset = useUpdateAsset();
  
  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema),
    defaultValues: asset
      ? { nome: asset.nome, valor: asset.valor }
      : { nome: "", valor: 0 },
  });
  
  async function onSubmit(data: AssetFormValues) {  
    setIsSubmitting(true);
    
    try {
      if (isEditMode && asset) {
        await updateAsset.mutateAsync({
          ...asset,
          ...data,
        });
        toast.success("Asset updated successfully");
      } else {
        await createAsset.mutateAsync(data);
        toast.success("Asset created successfully");
      }
      
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save asset");
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Asset name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="valor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Value</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-8"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditMode ? "Update Asset" : "Create Asset"}
        </Button>
      </form>
    </Form>
  );
}