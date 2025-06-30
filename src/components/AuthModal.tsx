import { AlertCircle, BarChart2, CheckCircle, Lock, Mail, Search, User } from 'lucide-react';
import React, { useState } from 'react';
import { authService } from '../services/authService';

interface AuthModalProps {
  onClose: () => void;
  onAuthSuccess: () => void;
  isDarkMode: boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onAuthSuccess, isDarkMode }) => {
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
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left: Welcome/Features */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-green-600 to-emerald-600 text-white p-10">
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
      </div>
      {/* Right: Auth Form */}
      <div className="flex flex-1 flex-col justify-center items-center bg-white min-h-screen">
        <div className="w-full max-w-md mx-auto p-8 rounded-xl shadow-none bg-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 text-center">{isSignUp ? 'Sign up for an account' : 'Sign in to your account'}</h2>
          <p className="mb-8 text-gray-500 text-center">{isSignUp ? 'Create your SoilSync account' : 'Welcome back! Please enter your details'}</p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Full Name
                </label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                    } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                  } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                  } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
            >
              {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;