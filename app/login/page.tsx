'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/libs/api';
import { toast, ToastContainer } from 'react-toastify';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token, role } = await login({ username, password });
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      toast.success('Login successful');
      router.push(role === 'admin' ? '/admin' : '/scan');
    } catch (err: any) { 
      toast.error(err.message || 'Error logging in');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <form onSubmit={handleSubmit}>
        <Input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4 p-2 border w-full"
        />
          {/* <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="mb-4 p-2 border w-full"
            required
          /> */}
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 p-2 border w-full"
            required
          />
          <Button type="submit" className="bg-blue-500 text-white p-2 w-full">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}