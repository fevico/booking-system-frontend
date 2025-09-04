import axios, { AxiosInstance, AxiosResponse } from 'axios';

interface FormData {
  name: string;
  email: string;
  phone: string;
  pin: string;
  organization: string;
  category: 'student' | 'academia' | 'press' | 'others';
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
  scans: number;
  name?: string;
  organization?: string;
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