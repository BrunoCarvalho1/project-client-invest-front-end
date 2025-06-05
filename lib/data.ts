"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Client, Asset, Allocation, ClientStatus } from '@/types';
import { clientsApi, assetsApi, allocationsApi } from './api';

// Client queries and mutations
export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await clientsApi.list();
      return response.data;
    },
  });
};

export const useClient = (id: string) => {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: async () => {
      const response = await clientsApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (client: Omit<Client, 'id' | 'createdAt'>) => {
      const response = await clientsApi.create(client);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (client: Client) => {
      const response = await clientsApi.update(client.id, client);
      return response.data;
    },
    onSuccess: (client) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients', client.id] });
    },
  });
};

export const useUpdateClientStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ClientStatus }) => {
      const response = await clientsApi.updateStatus(id, status);
      return response.data;
    },
    onSuccess: (client) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients', client.id] });
    },
  });
};

// Asset queries and mutations
export const useAssets = () => {
  return useQuery({
    queryKey: ['assets'],
    queryFn: async () => {
      const response = await assetsApi.list();
      return response.data;
    },
  });
};

export const useAsset = (id: string) => {
  return useQuery({
    queryKey: ['assets', id],
    queryFn: async () => {
      const response = await assetsApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateAsset = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (asset: Omit<Asset, 'id' | 'createdAt'>) => {
      const response = await assetsApi.create(asset);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
};

export const useUpdateAsset = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (asset: Asset) => {
      const response = await assetsApi.update(asset.id, asset);
      return response.data;
    },
    onSuccess: (asset) => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['assets', asset.id] });
    },
  });
};

// Allocation queries and mutations
export const useAllocations = () => {
  return useQuery({
    queryKey: ['allocations'],
    queryFn: async () => {
      const response = await allocationsApi.list();
      return response.data;
    },
  });
};

export const useCreateAllocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (allocation: Omit<Allocation, 'id' | 'percentage' | 'createdAt'>) => {
      const response = await allocationsApi.create(allocation);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocations'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
};

export const useDeleteAllocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await allocationsApi.delete(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocations'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
};