import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// TODO: Replace with actual backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  private static instance: ApiService;
  private axiosInstance: AxiosInstance;
  private token: string | null = null;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          console.error('Unauthorized access');
           // Vous pourriez rediriger vers la page de login ici
        }
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  public setToken(token: string | null) {
    this.token = token;
  }

  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  // Task endpoints
  public async getTasks(params?: any) {
    // TODO: Replace with actual API call
    // return this.axiosInstance.get('/tasks', { params });
    
    // Mock data for development
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: this.generateMockTasks(),
        });
      }, 500);
    });
  }

  public async getTask(id: string) {
    // TODO: Replace with actual API call
    // return this.axiosInstance.get(`/tasks/${id}`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: this.generateMockTask(id),
        });
      }, 300);
    });
  }

  public async createTask(data: any) {
    // TODO: Replace with actual API call
    // return this.axiosInstance.post('/tasks', data);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: { ...data, id: Date.now().toString() },
        });
      }, 500);
    });
  }

  public async updateTask(id: string, data: any) {
    // TODO: Replace with actual API call
    // return this.axiosInstance.put(`/tasks/${id}`, data);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: { ...data, id },
        });
      }, 500);
    });
  }

  public async deleteTask(id: string) {
    // TODO: Replace with actual API call
    // return this.axiosInstance.delete(`/tasks/${id}`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: { success: true, id },
        });
      }, 500);
    });
  }

  private generateMockTasks() {
    return Array.from({ length: 10 }, (_, i) => ({
      id: `task-${i + 1}`,
      title: `Task ${i + 1}`,
      description: `Description for task ${i + 1}`,
      status: ['pending', 'in-progress', 'completed'][i % 3] as any,
      priority: ['low', 'medium', 'high'][i % 3] as any,
      dueDate: new Date(Date.now() + (i * 86400000)).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }

  private generateMockTask(id: string) {
    return {
      id,
      title: `Task ${id}`,
      description: `Description for task ${id}`,
      status: 'pending',
      priority: 'medium',
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}

export const apiService = ApiService.getInstance();