'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Mail,
  Phone,
  Lock,
  CheckCircle,
  Eye,
  EyeOff,
  AlertCircle,
  Send,
  Chrome,
} from 'lucide-react';
import axios from 'axios';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithCredential,
} from 'firebase/auth';
import { auth } from '../firebase';
import { Capacitor } from '@capacitor/core';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname.includes('ruchibazaar.in')
    ? 'https://api.ruchibazaar.in/api'
    : 'http://localhost:7000/api');
const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '839794263601-2pk8ea39dvhk4pis940n89qimuuq879b.apps.googleusercontent.com';

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isNative, setIsNative] = useState(false);
  const router = useRouter();

  const password = watch('password');

  const saveSessionAndRedirect = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    router.push('/');
  };

  useEffect(() => {
    let isMounted = true;

    // Detect if running inside Capacitor Android/iOS native app
    try {
      if (typeof window !== 'undefined' && Capacitor.isNativePlatform()) {
        setIsNative(true);
      }
    } catch (e) {
      // ignore
    }

    // 1. Listen for redirect result on page load (Web flow)
    async function processRedirectResult() {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user && isMounted) {
          setGoogleLoading(true);
          const firebaseIdToken = await result.user.getIdToken();
          const response = await axios.post(`${API_URL}/auth/google`, {
            firebaseIdToken,
          });

          if (response.data.success) {
            saveSessionAndRedirect(response.data);
          } else {
            setError(response.data.message || 'Google signup failed');
          }
        }
      } catch (err) {
        console.error('Redirect result error:', err);
        if (err?.code === 'auth/missing-initial-state') {
          setError(
            'Google Sign-In session expired or cookies were blocked. Please enable cookies or sign up with your details.'
          );
        } else if (err?.message) {
          setError(err.message);
        }
      } finally {
        if (isMounted) setGoogleLoading(false);
      }
    }
    processRedirectResult();

    // 2. Initialize Google Identity Services (GIS) for Web (skipped on native)
    const handleGISCredentialResponse = async (response) => {
      if (!response?.credential || !isMounted) return;
      setGoogleLoading(true);
      setError('');
      try {
        const credential = GoogleAuthProvider.credential(response.credential);
        const userCredential = await signInWithCredential(auth, credential);
        const firebaseIdToken = await userCredential.user.getIdToken();

        const res = await axios.post(`${API_URL}/auth/google`, {
          firebaseIdToken,
        });

        if (res.data.success) {
          saveSessionAndRedirect(res.data);
        } else {
          setError(res.data.message || 'Google signup failed');
        }
      } catch (err) {
        console.error('GIS signup error:', err);
        setError(err.response?.data?.message || err.message || 'Google signup failed');
      } finally {
        if (isMounted) setGoogleLoading(false);
      }
    };

    const initGIS = () => {
      // Do not run web GIS iframe inside native Capacitor APK
      if (typeof window !== 'undefined' && Capacitor.isNativePlatform()) {
        return;
      }
      if (typeof window !== 'undefined' && window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGISCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          const btnContainer = document.getElementById('google-gis-signup-button');
          if (btnContainer && !btnContainer.hasChildNodes()) {
            window.google.accounts.id.renderButton(btnContainer, {
              theme: 'outline',
              size: 'large',
              type: 'standard',
              text: 'signup_with',
              shape: 'rectangular',
              logo_alignment: 'left',
              width: 360,
            });
          }
        } catch (e) {
          console.warn('GIS init error:', e);
        }
      }
    };

    initGIS();
    const interval = setInterval(() => {
      if (window.google?.accounts?.id) {
        initGIS();
        clearInterval(interval);
      }
    }, 400);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [router]);

  const onSubmit = async (data) => {
    setError('');

    if (!/^\d{10}$/.test(data.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (data.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: 'customer',
      });

      if (response.data.success) {
        saveSessionAndRedirect(response.data);
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Signup Error:', error.response?.data || error);
      const message = error.response?.data?.message || error.message || 'Registration failed. Please try again.';

      if (message.toLowerCase().includes('already')) {
        setError('An account with this email or phone already exists. Please login instead.');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      // 1. Native Capacitor flow (Android APK)
      const isNativeApp =
        typeof window !== 'undefined' && Capacitor.isNativePlatform();

      if (isNativeApp) {
        try {
          const { GoogleSignIn } = await import('@capawesome/capacitor-google-sign-in');
          await GoogleSignIn.initialize({
            clientId: GOOGLE_CLIENT_ID,
          });

          const result = await GoogleSignIn.signIn();
          if (!result?.idToken) {
            throw new Error('No ID token returned from Google Sign-In');
          }

          const credential = GoogleAuthProvider.credential(result.idToken);
          const userCredential = await signInWithCredential(auth, credential);
          const firebaseIdToken = await userCredential.user.getIdToken();

          const response = await axios.post(`${API_URL}/auth/google`, {
            firebaseIdToken,
          });

          if (response.data.success) {
            saveSessionAndRedirect(response.data);
          } else {
            setError(response.data.message || 'Google signup failed');
          }
        } catch (nativeError) {
          console.error('Native Google Sign-In error:', nativeError);
          const msg = nativeError?.message || '';
          if (
            msg.includes('SIGN_IN_CANCELED') ||
            msg.includes('canceled') ||
            msg.includes('cancelled') ||
            nativeError?.code === 'SIGN_IN_CANCELED'
          ) {
            // Dismissed by user
          } else {
            setError(
              msg ||
                nativeError?.response?.data?.message ||
                'Google sign-in was cancelled or failed.'
            );
          }
        } finally {
          setGoogleLoading(false);
        }
        return;
      }

      // 2. Web browser flow (popups or redirect)
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      // On mobile devices, mobile Chrome/Safari opens popups as separate tabs and severs window.opener,
      // which leads to the "missing initial state" error. signInWithRedirect preserves state in the same tab.
      const isMobile =
        typeof navigator !== 'undefined' &&
        (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || (typeof window !== 'undefined' && window.innerWidth <= 768));

      if (isMobile) {
        await signInWithRedirect(auth, provider);
        return;
      }

      let firebaseResult = null;
      try {
        firebaseResult = await signInWithPopup(auth, provider);
      } catch (popupError) {
        if (
          popupError.code === 'auth/popup-blocked' ||
          popupError.code === 'auth/popup-closed-by-user' ||
          popupError.code === 'auth/cancelled-popup-request'
        ) {
          console.warn('Popup blocked/closed, redirecting:', popupError);
          await signInWithRedirect(auth, provider);
          return;
        }
        throw popupError;
      }

      if (!firebaseResult?.user) {
        throw new Error('No user returned from Google authentication');
      }

      const firebaseIdToken = await firebaseResult.user.getIdToken();

      const response = await axios.post(`${API_URL}/auth/google`, {
        firebaseIdToken,
      });

      if (response.data.success) {
        saveSessionAndRedirect(response.data);
      } else {
        setError(response.data.message || 'Google signup failed');
      }
    } catch (error) {
      console.error('Google Signup Error:', error.response?.data || error);
      if (error?.code === 'auth/missing-initial-state') {
        setError(
          'Google Sign-In session state was missing or blocked by the browser. Please check browser cookie settings or sign up with details.'
        );
      } else {
        setError(
          error.response?.data?.message ||
            error.message ||
            'Google signup failed. Please try again.'
        );
      }
    } finally {
      const isMobile =
        typeof navigator !== 'undefined' &&
        (/Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
          (typeof window !== 'undefined' && window.innerWidth <= 768));
      if (!isMobile) {
        setGoogleLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-white opacity-10" />

      <div className="relative w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-gray-500">Join us as a customer! It&apos;s free and easy.</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  {...register('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                  })}
                  className={`block w-full pl-10 pr-3 py-2.5 border ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-black placeholder-gray-400`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className={`block w-full pl-10 pr-3 py-2.5 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-black placeholder-gray-400`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Please enter a valid 10-digit phone number',
                    },
                  })}
                  className={`block w-full pl-10 pr-3 py-2.5 border ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-black placeholder-gray-400`}
                  placeholder="9876543210"
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Enter 10-digit mobile number (without country code)
              </p>
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className={`block w-full pl-10 pr-12 py-2.5 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-black placeholder-gray-400`}
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>

            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CheckCircle className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match',
                  })}
                  className={`block w-full pl-10 pr-12 py-2.5 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-black placeholder-gray-400`}
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  {...register('terms', { required: 'You must accept the terms and conditions' })}
                  className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-600">
                  I agree to the{' '}
                  <Link href="/terms-and-conditions" className="text-purple-600 hover:text-purple-500 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy-policy" className="text-purple-600 hover:text-purple-500 hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.terms && (
                <p className="text-sm text-red-600 mt-1">{errors.terms.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 focus:ring-4 focus:ring-purple-300 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-6"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                  <span>Creating account...</span>
                </div>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Create Account</span>
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

          <div className="w-full flex flex-col items-center justify-center space-y-3">
            {!isNative && (
              <div id="google-gis-signup-button" className="w-full flex justify-center min-h-[44px]"></div>
            )}

            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={googleLoading || loading}
              className="w-full border border-gray-300 bg-white text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
            >
              {googleLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-gray-700 rounded-full animate-spin" />
                  <span>Connecting...</span>
                </div>
              ) : (
                <>
                  <Chrome className="h-5 w-5" />
                  <span>Sign up with Google</span>
                </>
              )}
            </button>
          </div>

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-purple-600 hover:text-purple-500 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
