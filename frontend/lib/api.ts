// Centralized API client with JWT handling
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include JWT token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle token expiration
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Clear auth token if unauthorized
          localStorage.removeItem('auth_token');
          // Redirect to login page (you might want to use router.push here)
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication endpoints
  async register(userData: { email: string; password: string; name: string }) {
    return this.client.post('/auth/register', userData);
  }

  async login(credentials: { email: string; password: string }) {
    return this.client.post('/auth/login', credentials);
  }

  async logout() {
    return this.client.post('/auth/logout');
  }

  // Task endpoints
  async getTasks(params?: { status?: string; priority?: string; limit?: number; offset?: number }) {
    return this.client.get('/tasks', { params });
  }

  async createTask(taskData: { title: string; description?: string; status?: string; priority?: string; due_date?: string }) {
    return this.client.post('/tasks', taskData);
  }

  async getTask(taskId: string) {
    return this.client.get(`/tasks/${taskId}`);
  }

  async updateTask(taskId: string, taskData: any) {
    return this.client.put(`/tasks/${taskId}`, taskData);
  }

  async deleteTask(taskId: string) {
    return this.client.delete(`/tasks/${taskId}`);
  }

  // Generic request method
  async request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.request<T>(config);
  }
}

export const apiClient = new ApiClient();
export default apiClient;