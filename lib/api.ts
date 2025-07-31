import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface ApiConfig {
  baseURL: string;
  timeout: number;
}

const config: ApiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
};

// Create axios instance
const api: AxiosInstance = axios.create(config);

// Token management
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const getAuthToken = () => authToken;

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth header if token exists
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      setAuthToken(null);
      // Redirect to login will be handled by AuthContext
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

// API Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'manager';
  };
}

export interface ManagerEarnings {
  managerId: string;
  managerName: string;
  managerType: string;
  period: string;
  baseCommission: number;
  milestoneEarnings: {
    halfMilestone: number;
    milestone1: number;
    milestone2: number;
    retention: number;
    total: number;
  };
  graduationBonus: number;
  diamondBonus: number;
  recruitmentBonus: number;
  downlineEarnings: number;
  totalEarnings: number;
  creatorCount: number;
  totalRevenue: number;
}

export interface UploadBatch {
  id: string;
  dataMonth: string;
  fileName: string;
  originalFileName: string;
  uploadedBy: string;
  totalRows: number;
  processedRows: number;
  skippedRows: number;
  warnings: string[];
  newCreatorsCount: number;
  newManagersCount: number;
  transactionsCreated: number;
  bonusesCreated: number;
  createdAt: string;
}

export interface GenealogyNode {
  id: string;
  manager: {
    id: string;
    name: string;
    type: string;
  };
  parentManager: {
    id: string;
    name: string;
    type: string;
  };
  level: 'A' | 'B' | 'C';
  commissionRate: number;
  createdAt: string;
}

export interface PayoutRequest {
  id: string;
  managerId: string;
  period: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  requestedAt: string;
}

// Utility Functions
export const generateMonthOptions = () => {
  const months = [];
  const now = new Date();
  
  // Generate last 12 months
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const period = `${year}${month}`;
    const label = date.toLocaleDateString('de-DE', { 
      year: 'numeric', 
      month: 'long' 
    });
    
    months.push({
      value: period,
      label: label,
    });
  }
  
  return months;
};

// API Endpoints
export const authApi = {
  login: (data: LoginRequest): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/auth/login', data),
  
  register: (data: RegisterRequest): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/auth/register', data),
  
  getCurrentUser: (): Promise<AxiosResponse<AuthResponse['user']>> =>
    api.get('/auth/me'),
  
  refreshToken: (): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/auth/refresh'),
};

export const managersApi = {
  getEarnings: (managerId: string, month: string): Promise<AxiosResponse<ManagerEarnings>> =>
    api.get(`/managers/${managerId}/earnings?month=${month}`),
  
  getAllEarnings: (month: string): Promise<AxiosResponse<ManagerEarnings[]>> =>
    api.get(`/managers/earnings?month=${month}`),
  
  awardRecruitmentBonus: (data: {
    managerId: string;
    period: string;
    managerType: 'live' | 'team';
    description?: string;
  }): Promise<AxiosResponse<any>> =>
    api.post('/managers/recruitment-bonus', data),
  
  getCommissionRates: (): Promise<AxiosResponse<any>> =>
    api.get('/managers/commission-rates'),
  
  requestPayout: (data: {
    managerId: string;
    period: string;
    amount: number;
  }): Promise<AxiosResponse<PayoutRequest>> =>
    api.post('/payouts', data),
};

export const uploadsApi = {
  uploadExcel: (file: File): Promise<AxiosResponse<any>> => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/uploads/excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  getUploadBatches: (): Promise<AxiosResponse<UploadBatch[]>> =>
    api.get('/uploads/batches'),
  
  getUploadBatch: (id: string): Promise<AxiosResponse<UploadBatch>> =>
    api.get(`/uploads/batches/${id}`),
};

export const genealogyApi = {
  getAll: (): Promise<AxiosResponse<GenealogyNode[]>> =>
    api.get('/genealogy'),
  
  getTeamDownline: (teamManagerId: string): Promise<AxiosResponse<any>> =>
    api.get(`/genealogy/team/${teamManagerId}`),
  
  create: (data: {
    managerId: string;
    parentManagerId: string;
    level: 'A' | 'B' | 'C';
    commissionRate: number;
  }): Promise<AxiosResponse<GenealogyNode>> =>
    api.post('/genealogy', data),
  
  update: (id: string, data: any): Promise<AxiosResponse<GenealogyNode>> =>
    api.put(`/genealogy/${id}`, data),
  
  delete: (id: string): Promise<AxiosResponse<void>> =>
    api.delete(`/genealogy/${id}`),
};

export default api; 