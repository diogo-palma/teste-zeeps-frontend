
import axios from 'axios';


const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});


export const getClients = async (page, limit, filterName = '') => {
  try {    
    const response = await apiClient.get(`/clientes`, {
      params: { page, limit, TECL_NOME: filterName},
    });
    return response.data;    
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    throw error;
  }
};


export const addClient = async (client) => {
  try {
    const response = await apiClient.post('/cliente', client);
    return response.data;
  } catch (error) {
    console.error("Erro ao adicionar cliente:", error);
    throw error;
  }
};

export const updateClient = async (client) => {
  try {    
    const response = await apiClient.put(`/cliente`, client);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    throw error;
  }
};

export const getClient = async (id, client) => {
  try {
    const response = await apiClient.get(`/cliente/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    throw error;
  }
};

export const removeClient = async (id) => {
  try {
    const response = await apiClient.delete(`/cliente/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    throw error;
  }
};