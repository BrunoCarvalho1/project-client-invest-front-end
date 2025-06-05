import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3000', // URL do seu backend Fastify
})
