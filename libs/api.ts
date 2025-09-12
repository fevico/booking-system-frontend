
// import axios, { AxiosInstance, AxiosResponse } from 'axios';

// interface FormData {
//   name: string;
//   email: string;
//   phone: string;
//   pin: string;
//   organization: string;
//   category: 'Student' | 'Academia' | 'Press' | 'Others';
// }

// interface VerifyRequest {
//   qrData: string;
// }

// interface LoginRequest {
//   username: string;
//   password: string;
// }

// interface ResponseData {
//   message: string;
//   qrCode?: string;
// }

// interface VerifyResponse {
//   message: string;
//   lastScan?: string | null;
//   name?: string;
//   organization?: string;
// }

// interface LoginResponse {
//   token: string;
//   role: 'admin' | 'scanner';
// }

// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   phone: string;
//   organization: string;
//   guestCategory: string;
//   lastScan?: string | null;
// }

// interface PaginatedResponse {
//   users?: User[];
//   attendees?: User[];
//   currentPage: number;
//   totalPages: number;
//   totalUsers?: number;
//   totalAttendees?: number;
// }

// const api: AxiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6000/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export const login = async (loginData: LoginRequest): Promise<LoginResponse> => {
//   try {
//     const response: AxiosResponse<LoginResponse> = await api.post('/login', loginData);
//     console.log('Login response:', response.data);
//     return response.data;
//   } catch (err: any) {
//     console.log('Login error:', err);
//     throw new Error(err.response?.data?.message || 'Error logging in');
//   }
// };

// export const registerUser = async (formData: FormData): Promise<ResponseData> => {
//   try {
//     const response: AxiosResponse<ResponseData> = await api.post('/register', formData);
//     console.log('API response:', response.data);
//     return response.data;
//   } catch (err: any) {
//     console.log('API error:', err);
//     throw new Error(err.response?.data?.message || 'Network Error');
//   }
// };

// export const verifyQR = async (qrData: VerifyRequest, token: string): Promise<VerifyResponse> => {
//   try {
//     const response: AxiosResponse<VerifyResponse> = await api.post('/verify', qrData, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     console.log('Verify QR response:', response.data);
//     return response.data;
//   } catch (err: any) {
//     console.log('Verify QR error:', err);
//     throw new Error(err.response?.data?.message || 'Error verifying QR code');
//   }
// };

// export const getUsers = async (page: number, limit: number, token: string): Promise<PaginatedResponse> => {
//   try {
//     const response: AxiosResponse<PaginatedResponse> = await api.get(`/users?page=${page}&limit=${limit}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     console.log(response, 'response for users');
//     return response.data;
//   } catch (err: any) {
//     console.log('Get users error:', err);
//     throw new Error(err.response?.data?.message || 'Error fetching users');
//   }
// };

// export const getAttendees = async (page: number, limit: number, token: string): Promise<PaginatedResponse> => {
//   try {
//     const response: AxiosResponse<PaginatedResponse> = await api.get(`/attendance?page=${page}&limit=${limit}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     console.log(response, 'response for attendees');
//     return response.data;
//   } catch (err: any) {
//     console.log('Get attendees error:', err);
//     throw new Error(err.response?.data?.message || 'Error fetching attendees');
//   }
// };

// export const exportPins = async (token: string) => {
//   try {
//     const response = await api.get('/export-pins', {
//       headers: { Authorization: `Bearer ${token}` },
//       responseType: 'blob',
//     });
//     const url = window.URL.createObjectURL(new Blob([response.data]));
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', 'pins.csv');
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//   } catch (err: any) {
//     throw new Error(err.response?.data?.message || 'Error exporting PINs');
//   }
// };


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

interface LoginRequest {
  username: string;
  password: string;
}

interface GeneratePinsRequest {
  count: number;
}

interface ResponseData {
  message: string;
  qrCode?: string;
}

interface VerifyResponse {
  message: string;
  lastScan?: string | null;
  name?: string;
  organization?: string;
}

interface LoginResponse {
  token: string;
  role: 'admin' | 'scanner';
}

interface GeneratePinsResponse {
  message: string;
  pins: { code: string }[];
}

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  guestCategory: string;
  lastScan?: string | null;
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
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (loginData: LoginRequest): Promise<LoginResponse> => {
  try {
    const response: AxiosResponse<LoginResponse> = await api.post('/login', loginData);
    console.log('Login response:', response.data);
    return response.data;
  } catch (err: any) {
    console.log('Login error:', err);
    throw new Error(err.response?.data?.message || 'Error logging in');
  }
};

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

export const verifyQR = async (qrData: VerifyRequest, token: string): Promise<VerifyResponse> => {
  try {
    const response: AxiosResponse<VerifyResponse> = await api.post('/verify', qrData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Verify QR response:', response.data);
    return response.data;
  } catch (err: any) {
    console.log('Verify QR error:', err);
    throw new Error(err.response?.data?.message || 'Error verifying QR code');
  }
};

export const getUsers = async (page: number, limit: number, token: string): Promise<PaginatedResponse> => {
  try {
    const response: AxiosResponse<PaginatedResponse> = await api.get(`/users?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response, 'response for users');
    return response.data;
  } catch (err: any) {
    console.log('Get users error:', err);
    throw new Error(err.response?.data?.message || 'Error fetching users');
  }
};

export const getAttendees = async (page: number, limit: number, token: string): Promise<PaginatedResponse> => {
  try {
    const response: AxiosResponse<PaginatedResponse> = await api.get(`/attendance?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response, 'response for attendees');
    return response.data;
  } catch (err: any) {
    console.log('Get attendees error:', err);
    throw new Error(err.response?.data?.message || 'Error fetching attendees');
  }
};

export const exportPins = async (token: string) => {
  try {
    const response = await api.get('/export-pins', {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob',
    });
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

export const generatePins = async (count: number, token: string): Promise<GeneratePinsResponse> => {
  try {
    const response: AxiosResponse<GeneratePinsResponse> = await api.post(
      '/generate-pins',
      { count },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('Generate pins response:', response.data);
    return response.data;
  } catch (err: any) {
    console.log('Generate pins error:', err);
    throw new Error(err.response?.data?.message || 'Error generating PINs');
  }
};