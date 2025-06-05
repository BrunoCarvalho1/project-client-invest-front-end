export type ClientStatus = 'active' | 'inactive';

export interface Client {
  id: string;
  name: string;
  email: string;
  status: ClientStatus;
  createdAt: string;
}

export interface Asset {
  id: string;
  nome: string;
  valor: number;
  createdAt: string;
}

export interface Allocation {
  id: string;
  clientId: string;
  assetId: string;
  amount: number;
  percentage: number;
  createdAt: string;
}

export interface ClientWithAssets extends Client {
  allocations: (Allocation & { asset: Asset })[];
  totalAllocated: number;
}

export interface AssetWithClients extends Asset {
  allocations: (Allocation & { client: Client })[];
  totalAllocated: number;
}