'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminAuth } from '@/lib/auth';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await adminAuth.isAuthenticated();
      if (isAuth) {
        router.push('/admin/dashboard');
      }
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await adminAuth.login(email, password);

    if (result.success) {
      router.push('/admin/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }

    setIsLoading(false);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-600 mt-2">Philippines eTravel Admin Panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Authorized personnel only</p>
          </div>
        </div>
      </div>
    </div>
  );
}
