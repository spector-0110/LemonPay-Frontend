'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiService } from '@/lib/api';
import { setAuthToken } from '@/lib/auth';
import { toast } from 'sonner';
import Image from 'next/image';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Home() {
  const [currentForm, setCurrentForm] = useState('login'); // 'login' or 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const schema = currentForm === 'login' ? loginSchema : signupSchema;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (currentForm === 'login') {
        const response = await apiService.login(data);
        setAuthToken(response.data.token);
        toast.success('Login successful!');
        router.push('/dashboard');
      } else {
        const response = await apiService.signup({
          email: data.email,
          password: data.password,
        });
        setAuthToken(response.data.token);
        toast.success('Account created successfully!');
        router.push('/dashboard');
      }
    } catch (error) {
      toast.error(error.message || `${currentForm === 'login' ? 'Login' : 'Signup'} failed`);
    } finally {
      setIsLoading(false);
    }
  };

  const switchForm = (formType) => {
    setCurrentForm(formType);
    reset();
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background with Animated Blobs */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-400 to-blue-900">
        {/* Animated Background Blobs */}
        <div 
          className="absolute -top-10 -right-10 w-40 sm:w-80 h-40 sm:h-80 rounded-full mix-blend-multiply filter blur-lg opacity-70 " 
          style={{backgroundColor: '#FDBC31'}}
        ></div>
        <div 
          className="absolute -bottom-10 -left-10 w-40 sm:w-80 h-40 sm:h-80 rounded-full mix-blend-multiply filter blur-lg opacity-70 "
          style={{backgroundColor: '#EC4899'}}
        ></div>
        <div 
          className="absolute -bottom-10 -right-10 w-40 sm:w-80 h-40 sm:h-80 rounded-full mix-blend-multiply filter blur-lg opacity-70 "
          style={{backgroundColor: '#2563EB'}}
        ></div>
      </div>

      {/* Header */}
      <header className="relative z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-2 py-3">
          <div className="flex items-center justify-center sm:justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3 mt-4 sm:mt-8"
            >
              {/* LemonPay Logo */}
              <div className="flex items-center">
                <div>
                  <div className="flex items-center">
                    <span className="text-4xl sm:text-6xl font-bold text-yellow-300 drop-shadow-lg">lem</span>
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center">
                      <Image src="/lemon.png" alt="Lemon" width={48} height={48} className="drop-shadow-lg sm:w-[56px] sm:h-[56px]" />
                    </div>
                    <span className="text-4xl sm:text-6xl font-bold text-yellow-300 drop-shadow-lg">n</span>
                    <span className="text-4xl sm:text-6xl font-bold text-green-300 drop-shadow-lg">pay</span>
                  </div>
                  <div className="text-base sm:text-xl text-center sm:text-left text-white font-medium drop-shadow-md">
                    <span className="text-yellow-200">Your success is</span>
                    <span className="text-green-300"> our focus</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-100px)] px-4 py-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 items-center">
          {/* Left Side - Hero Content - Hidden on mobile */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white text-center lg:text-left hidden lg:block"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl lg:text-6xl font-bold mb-6 drop-shadow-lg"
            >
              Join <span className="text-yellow-300">1000 </span> Businesses
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-2xl lg:text-4xl font-bold mb-8 drop-shadow-lg"
            >
              <span className="text-yellow-300">Powering Growth with</span>
              <br />
              <span className="text-white">Lemonpay!</span>
            </motion.h2>
          </motion.div>

          {/* Right Side - Auth Forms */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/25 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/40 shadow-2xl lg:col-start-2"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">
                Welcome {currentForm === 'login' ? 'Login' : 'Sign Up'} System
              </h3>
              <p className="text-white/90 drop-shadow-sm font-medium">
                Your gateway to seamless transactions and easy payments.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-white text-sm font-semibold mb-2 drop-shadow">Email</label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-4 py-3 bg-white/25 border border-white/40 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent font-medium shadow-lg"
                  placeholder="mahadev@lemonpay.tech"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-200 font-medium drop-shadow-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="relative">
                <label className="block text-white text-sm font-semibold mb-2 drop-shadow-sm">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className="w-full px-4 py-3 bg-white/25 border border-white/40 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent pr-12 font-medium shadow-lg"
                  placeholder="Min 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-white/80 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-200 font-medium drop-shadow-sm">{errors.password.message}</p>
                )}
              </div>

              {currentForm === 'signup' && (
                <div className="relative">
                  <label className="block text-white text-sm font-medium mb-2">Confirm Password</label>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword')}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent pr-12"
                    placeholder="Min 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-9 text-white/60 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-300">{errors.confirmPassword.message}</p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 bg-white/20 border-white/30 rounded focus:ring-white/50" />
                  <span className="ml-2 text-white/80 text-sm">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => switchForm(currentForm === 'login' ? 'signup' : 'login')}
                  className="text-white/80 hover:text-white text-sm font-medium"
                >
                  {currentForm === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </div>

              <Button
                variant='secondary'
                type="submit"
                className="w-full bg-white text-gray-900 hover:bg-gray-100 font-bold py-3 rounded-lg transition-all duration-200"
                loading={isLoading}
                disabled={isLoading}
              >
                {currentForm === 'login' ? 'Sign In' : 'Sign Up'}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
