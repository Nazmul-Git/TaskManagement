import axios from 'axios';
import { Task, TaskStatus } from '../types/task';

const API_BASE_URL = 'https://685bbc9189952852c2dac199.mockapi.io/api/v1';

export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await axios.get<Task[]>(`${API_BASE_URL}/tasks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw new Error('Failed to fetch tasks');
  }
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