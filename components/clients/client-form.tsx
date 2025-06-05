"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema, ClientFormValues } from "@/lib/validation";
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
import { Client } from "@/types";
import { useCreateClient, useUpdateClient } from "@/lib/data";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ClientFormProps {
  client?: Client;
  onSuccess?: () => void;
}

export function ClientForm({ client, onSuccess }: ClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditMode = !!client;
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: client
      ? { name: client.name, email: client.email, status: client.status }
      : { name: "", email: "", status: "active" },
  });
  
  async function onSubmit(data: ClientFormValues) {
    setIsSubmitting(true);
    
    try {
      if (isEditMode && client) {
        await updateClient.mutateAsync({
          ...client,
          ...data,
        });
        toast.success("Client updated successfully");
      } else {
        await createClient.mutateAsync(data);
        toast.success("Client created successfully");
      }
      
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save client");
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Client name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditMode ? "Update Client" : "Create Client"}
        </Button>
      </form>
    </Form>
  );
}