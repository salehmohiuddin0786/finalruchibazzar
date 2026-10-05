'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { Mail, Phone, ArrowLeft, CheckCircle2, ShieldAlert, Headphones } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contactValue, setContactValue] = useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    setContactValue(data.contact);
    // Simulate support ticket / reset trigger
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Reset Your Password</h1>
          <p className="text-gray-600 mt-2 text-sm">
            Enter your registered email address or phone number to receive reset instructions.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-green-900">Reset Request Received</h3>
              <p className="text-sm text-green-700 mt-1">
                If an account exists for <span className="font-semibold">{contactValue}</span>, our team or automated OTP will assist you shortly.
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 text-xs text-purple-800 space-y-2">
              <div className="flex items-center space-x-2 font-semibold">
                <Headphones className="w-4 h-4 text-purple-600" />
                <span>Need immediate assistance?</span>
              </div>
              <p>Contact Ruchi Bazaar Customer Support directly:</p>
              <p className="font-mono text-purple-900 font-bold">Email: support@ruchibazaar.com</p>
              <p className="font-mono text-purple-900 font-bold">Helpline: +91 1800 123 456</p>
            </div>

            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number or Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your phone (10 digits) or email"
                  {...register('contact', {
                    required: 'Please enter your phone number or email',
                    minLength: {
                      value: 5,
                      message: 'Please enter a valid phone number or email',
                    },
                  })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition text-gray-900 text-sm"
                />
                <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {errors.contact && (
                <p className="text-xs text-red-600 mt-1">{errors.contact.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 focus:ring-4 focus:ring-purple-300 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
            >
              {loading ? 'Sending Request...' : 'Send Reset Instructions'}
            </button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center space-x-1.5 text-xs sm:text-sm text-purple-600 hover:text-purple-500 font-medium hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Login</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
