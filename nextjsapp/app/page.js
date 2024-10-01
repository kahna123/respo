'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import CallFor from '@/utilities/CallFor';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (role === 'admin') {
        response = await CallFor("auth/login", "Post", { email, password }, "withoutAuth");
      } else if (role === 'waiter') {
        response = await CallFor("waiters/login", "Post", { email, password }, "withoutAuth");
      }

      if (!response?.data) {
        throw new Error('Login failed');
      }

      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('roleId', response.data.data.Rollid);
      sessionStorage.setItem('userdata', JSON.stringify(response.data));

      toast.success('Login successful!');

      // Redirect based on role ID
      if (response.data.data.Rollid == '1') {
        router.push('/admin');
      } else if (response.data.data.Rollid == '2') {
        router.push('/waiter');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {!role ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
          <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Select Role</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setRole('admin')}
                className="w-full px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Admin
              </button>
              <button
                onClick={() => setRole('waiter')}
                className="w-full px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Waiter
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleLogin}
          className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4"
        >
          <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Login as {role}</h1>

            <label className="block mb-5">
              <span className="text-sm font-medium text-gray-700">Email:</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-2 px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="block mb-5">
              <span className="text-sm font-medium text-gray-700">Password:</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full mt-2 px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Login
            </button>
          </div>
        </form>
      )}
    </>
  );
}
