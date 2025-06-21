import { mockTasks, mockUser } from './mockData';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';


class APIService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      
      // Handle validation errors specifically
      if (response.status === 400 && error.errors) {
        const validationError = new Error(error.message);
        validationError.validationErrors = error.errors;
        validationError.isValidationError = true;
        throw validationError;
      }
      
      throw new Error(error.message);
    }
    return response.json();
  }

  // Auth methods
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async signup(userData) {
    return this.register(userData);
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  // Task methods
  async createTask(taskData) {
    const response = await this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
    
    // Ensure we return the created task data for frontend state management
    // Expected response: { success: true, data: taskObject } or taskObject directly
    return response;
  }

  async getTasks(params = {}) {    
    const searchParams = new URLSearchParams(params);
    return this.request(`/tasks?${searchParams}`);
  }

  async getTask(id) {
    return this.request(`/tasks/${id}`);
  }

  async updateTask(id, taskData) {    
    const response = await this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
    
    // Ensure we return the updated task data for frontend state management
    // Expected response: { success: true, data: taskObject } or taskObject directly
    return response;
  }

  async deleteTask(id) {    
    return this.request(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  async getTaskStats() {
    return this.request('/tasks/stats');
  }
}

export const apiService = new APIService();
