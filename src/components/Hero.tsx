import { ArrowRight, Play } from 'lucide-react';
import React from 'react';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <section className="relative bg-gradient-to-br from-green-50 via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden transition-colors duration-200">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            AI-Powered Soil Analysis
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Optimize Your Crops with{' '}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              AI-Driven Soil Analysis
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your farming with intelligent soil insights, personalized fertilizer recommendations, 
            and real-time monitoring that maximizes your harvest potential.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <button
              onClick={onGetStarted}
              className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10 transition duration-300 ease-in-out shadow-lg"
            >
              Get Started <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
            </button>
            <button
              onClick={() => alert('Watch Demo clicked!')}
              className="flex items-center justify-center px-8 py-3 border border-green-600 text-base font-medium rounded-md text-green-700 bg-white hover:bg-green-50 md:py-4 md:text-lg md:px-10 transition duration-300 ease-in-out shadow-md dark:border-green-400 dark:text-green-300 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <Play className="mr-2 -ml-1 h-5 w-5" /> Watch Demo
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-green-400 rounded-full border-2 border-white dark:border-gray-800"></div>
                <div className="w-8 h-8 bg-blue-400 rounded-full border-2 border-white dark:border-gray-800"></div>
                <div className="w-8 h-8 bg-yellow-400 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>
              <span className="text-sm">Trusted by 10,000+ farmers</span>
            </div>
            
            <div className="text-sm">
              <span className="font-semibold text-green-600 dark:text-green-400">95%</span> improved yield rate
            </div>
            
            <div className="text-sm">
              <span className="font-semibold text-blue-600 dark:text-blue-400">24/7</span> monitoring support
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 dark:bg-green-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-40 right-10 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-yellow-200 dark:bg-yellow-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </section>
  );
};

export default Hero;