import axios from 'axios';

const API_BASE_URL = 'https://685bbc9189952852c2dac199.mockapi.io/api/v1';

export const fetchTasks = async (status?: TaskStatus): Promise<Task[]> => {
  const url = status ? `${API_BASE_URL}/tasks?status=${status}` : `${API_BASE_URL}/tasks`;
  const response = await axios.get(url);
  return response.data;
};

export const fetchTask = async (id: string): Promise<Task> => {
  const response = await axios.get(`${API_BASE_URL}/tasks/${id}`);
  return response.data;
};

export const createTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
  const response = await axios.post(`${API_BASE_URL}/tasks`, task);
  return response.data;
};

export const updateTask = async (id: string, task: Partial<Task>): Promise<Task> => {
  const response = await axios.put(`${API_BASE_URL}/tasks/${id}`, task);
  return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/tasks/${id}`);
};