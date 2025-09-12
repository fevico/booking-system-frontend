'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface ProtectedRouteProps {
  children: React.ReactNode;   
  requiredPassword: string;
}

export default function ProtectedRoute({ children, requiredPassword }: ProtectedRouteProps) {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === requiredPassword) {
      setIsAuthorized(true);
    } else {
      toast.error('Incorrect password');
      setPassword('');
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6">Enter Password</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="mb-4 p-2 border w-full"
              required
            />
            <button type="submit" className="bg-blue-500 text-white p-2 w-full">
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}