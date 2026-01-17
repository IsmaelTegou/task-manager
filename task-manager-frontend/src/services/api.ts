import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// URL du backend Spring Boot
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

class ApiService {
  private static instance: ApiService;
  private axiosInstance: AxiosInstance;
  
  // Stocker la fonction pour obtenir le token
  private getTokenFn: (() => string | null) | null = null;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor pour ajouter le token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor pour gérer les erreurs d'authentification
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expiré ou invalide
          console.error('Unauthorized access - token may be expired');
          // Vous pourriez déclencher un rafraîchissement du token ici
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

  // Méthode pour configurer comment obtenir le token
  public setTokenGetter(getTokenFn: () => string | null) {
    this.getTokenFn = getTokenFn;
  }

  private getToken(): string | null {
    if (this.getTokenFn) {
      return this.getTokenFn();
    }
    // Fallback: chercher dans localStorage
    return localStorage.getItem('kc_token');
  }

  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  // === REMPLACEZ LES MOCK PAR LES VRAIS APPELS API ===

  public async getTasks(params?: any) {
    // APPEL RÉEL
    return this.axiosInstance.get('/v1/tasks', { params });
  }

  public async getTask(id: string) {
    // APPEL RÉEL
    return this.axiosInstance.get(`/v1/tasks/${id}`);
  }

  public async createTask(data: any) {
    // APPEL RÉEL
    return this.axiosInstance.post('/v1/tasks', data);
  }

  public async updateTask(id: string, data: any) {
    // APPEL RÉEL
    return this.axiosInstance.put(`/v1/tasks/${id}`, data);
  }

  public async deleteTask(id: string) {
    // APPEL RÉEL
    return this.axiosInstance.delete(`/v1/tasks/${id}`);
  }
}

export const apiService = ApiService.getInstance();