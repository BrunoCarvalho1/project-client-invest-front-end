import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Erro na API:', error.response.data);
      throw new Error(error.response.data.message || 'Erro ao processar requisição');
    } else if (error.request) {
      console.error('Erro de rede:', error.request);
      throw new Error('Erro de conexão com o servidor');
    } else {
      console.error('Erro:', error.message);
      throw new Error('Erro ao fazer requisição');
    }
  }
);

export const clientsApi = {
  list: () => api.get('/clients'),
  getById: (id: string) => api.get(`/clients/${id}`),
  create: (data: any) => api.post('/clients', data),
  update: (id: string, data: any) => api.put(`/clients/${id}`, data),
  updateStatus: (id: string, status: string) => api.patch(`/clients/${id}/status`, { status }),
  getTotalAllocated: (id: string) => api.get(`/clients/${id}/total-allocated`),
};

export const assetsApi = {
  list: () => api.get('/assets'),
  getById: (id: string) => api.get(`/assets/${id}`),
  create: (data: any) => api.post('/assets', data),
  update: (id: string, data: any) => api.put(`/assets/${id}`, data),
};

export const allocationsApi = {
  list: () => api.get('/allocations'),
  create: (data: any) => api.post('/allocations', data),
  delete: (id: string) => api.delete(`/allocations/${id}`),
};

export default api;