import { z } from 'zod';

export const clientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  status: z.enum(["active", "inactive"]),
});

export const assetSchema = z.object({
  nome: z.string().min(2, "Name must be at least 2 characters"),
  valor: z.coerce.number().positive("Value must be greater than 0"),
});

export const allocationSchema = z.object({
  clienteId: z.coerce.number().positive("Client is required"),
  ativoId: z.coerce.number().positive("Asset is required"),
  quantidade: z.coerce.number().positive("Amount must be greater than 0"),
});

export type ClientFormValues = z.infer<typeof clientSchema>;
export type AssetFormValues = z.infer<typeof assetSchema>;
export type AllocationFormValues = z.infer<typeof allocationSchema>;