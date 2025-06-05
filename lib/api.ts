import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Erro do servidor com resposta
      console.error('Erro na API:', error.response.data);
      throw new Error(error.response.data.message || 'Erro ao processar requisição');
    } else if (error.request) {
      // Erro de rede sem resposta
      console.error('Erro de rede:', error.request);
      throw new Error('Erro de conexão com o servidor');
    } else {
      // Erro na configuração da requisição
      console.error('Erro:', error.message);
      throw new Error('Erro ao fazer requisição');
    }
  }
);

// Clientes
export const clientsApi = {
  list: () => api.get('/clients'),
  getById: (id: string) => api.get(`/clients/${id}`),
  create: (data: any) => api.post('/clients', data),
  update: (id: string, data: any) => api.put(`/clients/${id}`, data),
  updateStatus: (id: string, status: string) => api.patch(`/clients/${id}/status`, { status }),
};

// Ativos
export const assetsApi = {
  list: () => api.get('/assets'),
  getById: (id: string) => api.get(`/assets/${id}`),
  create: (data: any) => api.post('/assets', data),
  update: (id: string, data: any) => api.put(`/assets/${id}`, data),
};

// Alocações
export const allocationsApi = {
  list: () => api.get('/allocations'),
  create: (data: any) => api.post('/allocations', data),
  delete: (id: string) => api.delete(`/allocations/${id}`),
};

export default api;