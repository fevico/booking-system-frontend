
import axios, { AxiosInstance, AxiosResponse } from 'axios';

interface FormData {
  name: string;
  email: string;
  phone: string;
  pin: string;
  organization: string;
  category: 'Student' | 'Academia' | 'Press' | 'Others';
}

interface VerifyRequest {
  qrData: string;
}          

interface ResponseData {     
  message: string;
  qrCode?: string;
}

interface VerifyResponse {
  message: string;
  lastScan?: string | null; // Changed from scans
  name?: string;
  organization?: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  guestCategory: string;
  lastScan?: string | null; // Changed from scans
}

interface PaginatedResponse {
  users?: User[];
  attendees?: User[];
  currentPage: number;
  totalPages: number;
  totalUsers?: number;
  totalAttendees?: number;
}

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerUser = async (formData: FormData): Promise<ResponseData> => {
  try {
    const response: AxiosResponse<ResponseData> = await api.post('/register', formData);
    console.log('API response:', response.data);
    return response.data;
  } catch (err: any) {
    console.log('API error:', err);
    throw new Error(err.response?.data?.message || 'Network Error');
  }
};

export const verifyQR = async (qrData: VerifyRequest): Promise<VerifyResponse> => {
  try {
    const response: AxiosResponse<VerifyResponse> = await api.post('/validate-qrcode', qrData);
    console.log('Verify QR response:', response.data);
    return response.data;
  } catch (err: any) {
    console.log('Verify QR error:', err);
    throw new Error(err.response?.data?.message || 'Error verifying QR code');
  }
};

export const getUsers = async (page: number, limit: number): Promise<PaginatedResponse> => {
  try {
    const response: AxiosResponse<PaginatedResponse> = await api.get(`/users?page=${page}&limit=${limit}`);
    console.log(response, 'response for users');
    return response.data;
  } catch (err: any) {
    console.log('Get users error:', err);
    throw new Error(err.response?.data?.message || 'Error fetching users');
  }
};

export const getAttendees = async (page: number, limit: number): Promise<PaginatedResponse> => {
  try {
    const response: AxiosResponse<PaginatedResponse> = await api.get(`/attendance?page=${page}&limit=${limit}`);
    console.log(response, 'response for attendees');
    return response.data;
  } catch (err: any) {
    console.log('Get attendees error:', err);
    throw new Error(err.response?.data?.message || 'Error fetching attendees');
  }
};

export const exportPins = async () => {
  try {
    const response = await api.get('/export-pins', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'pins.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err: any) {
    throw new Error(err.response?.data?.message || 'Error exporting PINs');
  }
};