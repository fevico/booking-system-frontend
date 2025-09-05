
'use client';

import { useState, FormEvent } from 'react';
import { toast } from 'react-toastify';
import { registerUser } from '@/libs/api';
import { Input } from "@/components/ui/input"

import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface FormData {
  name: string;
  email: string;
  phone: string;
  pin: string;
  organization: string;
  category: 'student' | 'academia' | 'press' | 'others';
}

interface ResponseData {
  message: string;
  qrCode?: string;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    pin: '',
    organization: '',
    category: 'student',
  });
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    console.log(formData);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res: ResponseData = await registerUser(formData);
      setQrCode(res.qrCode || null);
      setMessage('Registration successful. QR code sent.');
      toast.success('Registration successful. QR code sent.', {
        position: 'top-right',
        autoClose: 3000,
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        pin: '',
        organization: '',
        category: 'student',
      });
    } catch (err: any) {
      console.log(err, 'error message');
      console.log(err.message);
      setMessage(err.message || 'Error');
        toast.error(err.message || 'Error', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6">Event Registration</h1>
        <Input name="name" placeholder='name' value={formData.name} onChange={handleChange} className='mb-4 p-2 border w-full' required/>
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="mb-4 p-2 border w-full"
          required
        />
        <Input
          name="phone"
          placeholder="Phone (+1234567890)"
          value={formData.phone}
          onChange={handleChange}
          className="mb-4 p-2 border w-full"
          required
        />
        <Input
          name="pin"
          placeholder="4-digit PIN"
          value={formData.pin}
          onChange={handleChange}
          className="mb-4 p-2 border w-full"
          required
        />
        <Input
          name="organization"
          placeholder="Organization"
          value={formData.organization}
          onChange={handleChange}
          className="mb-4 p-2 border w-full"
          required
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mb-4 p-2 border-2 w-full"
          required
        >
          <option value="student">Student</option>
          <option value="academia">Academia</option>
          <option value="press">Press</option>
          <option value="others">Others</option>
        </select>

        <Button type="submit" className="bg-blue-500 text-white p-2 w-full">Register</Button>
        {message && <p className="mt-4 text-center">{message}</p>}
        {qrCode && <Image src={qrCode} alt="QR Code" className="mt-4 mx-auto" />}
      </form>
    </div>
  );
}