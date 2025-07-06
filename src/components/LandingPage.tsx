import React from 'react';
import Contact from './Contact';
import Features from './Features';
import Footer from './Footer';
import Header from './Header';
import Hero from './Hero';
import Pricing from './Pricing';
import { User } from '../types';

interface LandingPageProps {
  isDarkMode: boolean;
  onGetStarted: () => void;
  isAuthenticated: boolean;
  user: any;
  onSignOut: () => void;
  toggleDarkMode: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ isDarkMode, onGetStarted, isAuthenticated, user, onSignOut, toggleDarkMode }) => {
  return (
    <div className={`min-h-screen w-full flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-200`}>
      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        onSignOut={onSignOut}
        onAuthClick={onGetStarted}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <main className="flex-1">
        <Hero onGetStarted={onGetStarted} isDarkMode={isDarkMode} />
        <Features isDarkMode={isDarkMode} />
        <Pricing isDarkMode={isDarkMode} />
        <Contact isDarkMode={isDarkMode} />
      </main>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default LandingPage;