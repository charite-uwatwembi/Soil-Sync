import { AlertCircle, ArrowLeft, Lock, Mail, User, X } from 'lucide-react';
import React, { useState } from 'react';
import { authService } from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
  isDarkMode: boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess, isDarkMode }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await authService.signUp(email, password, fullName);
      } else {
        await authService.signIn(email, password);
      }
      onAuthSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col w-full max-w-sm max-h-[90vh] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 z-10"
          aria-label="Close authentication form"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Left: Welcome/Features (Removed as per design) */}
        {/* <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-green-600 to-emerald-600 text-white p-10">
          <h1 className="text-3xl font-bold mb-4">Welcome to SoilSync</h1>
          <p className="mb-8 text-lg text-center">Your smart companion for sustainable agriculture and soil management</p>
          <ul className="space-y-6 w-full max-w-xs">
            <li className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-white bg-green-700 rounded-full p-1" />
              <span>Real-time soil analysis and recommendations</span>
            </li>
            <li className="flex items-center space-x-3">
              <BarChart2 className="h-6 w-6 text-white bg-green-700 rounded-full p-1" />
              <span>Advanced ML-powered predictions</span>
            </li>
            <li className="flex items-center space-x-3">
              <Search className="h-6 w-6 text-white bg-green-700 rounded-full p-1" />
              <span>Comprehensive soil health monitoring</span>
            </li>
          </ul>
        </div> */}

        {/* Auth Form - now full width and centered */}
        <div className="flex flex-1 flex-col justify-center items-center p-8 overflow-y-auto w-full">
          <div className="w-full max-w-md rounded-xl shadow-none bg-white dark:bg-gray-800">
            {/* Back Arrow and Header */}
            <div className="flex items-center mb-4">
              {!isSignUp && (
                <button onClick={onClose} className="mr-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center flex-grow">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
            </div>
            <p className="mb-6 text-gray-500 dark:text-gray-400 text-center">
              {isSignUp ? 'Enter your details to create an account.' : 'Please enter your details.'}
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-600">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-colors"
                    placeholder="Enter your password"
                  />
                  {/* Add eye icon for show/hide password if needed */}
                </div>
              </div>

              {/* Remember me and Forgot Password */}
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-gray-900 dark:text-gray-300">Remember me</label>
                </div>
                <button type="button" className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300">Forgot Password?</button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md"
              >
                {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </button>
            </form>

            {/* Or continue with separator */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
              </div>
            </div>

            {/* Social Sign-in Buttons */}
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                <img src="/public/google-icon.svg" alt="Google" className="h-5 w-5 mr-2" />
                Sign in with Google
              </button>
              
            </div>

            <div className="mt-6 text-center text-sm">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;