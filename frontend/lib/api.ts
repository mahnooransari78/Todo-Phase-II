// Centralized API client with JWT handling
import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'),
      timeout: 120000, // 120 second timeout (2 minutes) - increased for AI operations
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include JWT token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth_token');
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {






        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle token expiration
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (typeof window !== 'undefined' && error.response?.status === 401) {
          // Check if this is an auth endpoint (don't redirect during login/register)
          const isAuthEndpoint = error.config?.url?.includes('/auth/');

          if (!isAuthEndpoint) {
            // Clear auth token and userId if unauthorized (but not for auth endpoints)
            localStorage.removeItem('auth_token');
            localStorage.removeItem('userId');

            // Redirect to login page (you might want to use router.push here)
            // For chat functionality, we should avoid automatic redirect if it's an API call from chat
            const isChatEndpoint = error.config?.url?.includes('/chat/');

            if (!isChatEndpoint) {
              window.location.href = '/login';
            } else {
              // For chat endpoints, we'll let the chat component handle the error
              // so that we can show a proper error message in the chat UI
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication endpoints
  async register(userData: { email: string; password: string; name: string }) {
    return this.client.post('/api/auth/register', userData);
  }

  async login(credentials: { email: string; password: string }) {
    return this.client.post('/api/auth/login', credentials);
  }

  async logout() {
    return this.client.post('/api/auth/logout');
  }

  // Task endpoints
  async getTasks(params?: { status?: string; priority?: string; limit?: number; offset?: number }) {
    return this.client.get('/api/tasks', { params });
  }

  async createTask(taskData: { title: string; description?: string; status?: string; priority?: string; due_date?: string }) {
    return this.client.post('/api/tasks', taskData);
  }

  async getTask(taskId: string) {
    return this.client.get(`/api/tasks/${taskId}`);
  }

  async updateTask(taskId: string, taskData: any) {
    return this.client.put(`/api/tasks/${taskId}`, taskData);
  }

  async deleteTask(taskId: string) {
    return this.client.delete(`/api/tasks/${taskId}`);
  }

  // Chat endpoint
  async sendChatMessage(data: { userId: string; conversationId?: string; message: string }) {
    return this.client.post('/api/chat/' + data.userId, data);
  }

  // Generic request method
  async request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.request<T>(config);
  }
}

// Create a single instance of the API client
const apiClient = new ApiClient();

export { apiClient };
export default apiClient;