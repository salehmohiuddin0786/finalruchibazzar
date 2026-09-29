'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext.jsx';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Mail,
  Lock,
  LogIn,
  Eye,
  EyeOff,
  AlertCircle,
  Chrome,
} from 'lucide-react';
import axios from 'axios';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    const result = await login({
      email: data.email,
      password: data.password,
    });

    if (result.success) {
      if (result.user?.role === 'customer') {
        router.push('/');
      } else if (result.user?.role === 'partner') {
        setError('Please use the partner login portal');
        setTimeout(() => router.push('/Login'), 2000);
      } else if (result.user?.role === 'admin') {
        setError('Please use the admin login portal');
        setTimeout(() => router.push('/admin/login'), 2000);
      } else {
        router.push('/');
      }
    } else if (result.error?.toLowerCase().includes('use appropriate login portal')) {
      setError('This account is for partners/admins. Please use the correct login portal.');
    } else if (result.error?.toLowerCase().includes('invalid credentials')) {
      setError('Invalid email or password. Please try again.');
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const firebaseResult = await signInWithPopup(auth, provider);
      const firebaseIdToken = await firebaseResult.user.getIdToken();

      const response = await axios.post(`${API_URL}/auth/google`, {
        firebaseIdToken,
      });

      if (response.data.success) {
        await login({ token: response.data.token, user: response.data.user });
        router.push('/');
      } else {
        setError(response.data.message || 'Google login failed');
      }
    } catch (error) {
      console.error('Google Login Error:', error.response?.data || error);
      setError(
        error.response?.data?.message ||
          error.message ||
          'Google login failed. Please try again.'
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-grid-white opacity-10 hidden sm:block" />

      <div className="relative w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5 sm:space-y-6">
          <div className="text-center space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-sm sm:text-base text-gray-500">Customer Login</p>
            <p className="text-xs text-gray-400">Sign in to access your account</p>
          </div>

          {error && (
            <div className={`border-l-4 p-3 sm:p-4 rounded ${
              error.includes('partner') || error.includes('admin')
                ? 'bg-yellow-50 border-yellow-500'
                : 'bg-red-50 border-red-500'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className={`h-4 w-4 sm:h-5 sm:w-5 ${
                    error.includes('partner') || error.includes('admin')
                      ? 'text-yellow-400'
                      : 'text-red-400'
                  }`} />
                </div>
                <div className="ml-3">
                  <p className={`text-xs sm:text-sm ${
                    error.includes('partner') || error.includes('admin')
                      ? 'text-yellow-700'
                      : 'text-red-600'
                  }`}>
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className={`block w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 text-sm sm:text-base border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-black placeholder-gray-400`}
                  placeholder="customer@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className={`block w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-2.5 text-sm sm:text-base border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-black placeholder-gray-400`}
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 xs:gap-0">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
                <span className="text-xs sm:text-sm text-gray-600">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-xs sm:text-sm text-purple-600 hover:text-purple-500 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 sm:py-2.5 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 focus:ring-4 focus:ring-purple-300 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <>
                  <LogIn className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Sign In as Customer</span>
                </>
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-3 text-gray-500">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full border border-gray-300 bg-white text-gray-700 py-2 sm:py-2.5 rounded-lg font-semibold hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {googleLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-b-2 border-gray-700 rounded-full animate-spin" />
                <span>Connecting...</span>
              </div>
            ) : (
              <>
                <Chrome className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div className="text-center pt-3 sm:pt-4 border-t border-gray-200">
            <p className="text-xs sm:text-sm text-gray-600">
              Don&apos;t have a customer account?{' '}
              <Link href="/signup" className="text-purple-600 hover:text-purple-500 font-semibold hover:underline">
                Create one now
              </Link>
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Are you a restaurant partner?{' '}
              <Link href="/Login" className="text-purple-600 hover:text-purple-500 hover:underline">
                Partner Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
