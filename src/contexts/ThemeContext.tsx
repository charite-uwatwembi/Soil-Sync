import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeContextType } from '../types';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    console.log('ThemeContext useEffect: savedTheme:', savedTheme);
    
    // Prioritize saved theme. If no theme is saved, default to light.
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
      console.log('ThemeContext useEffect: Setting to dark based on saved preference.');
    } else {
      // If savedTheme is 'light' or no theme is saved, default to light.
      setIsDark(false);
      document.documentElement.classList.remove('dark');
      console.log('ThemeContext useEffect: Setting to light by default or saved preference.');
    }
    console.log('ThemeContext useEffect: document.documentElement.classList:', document.documentElement.classList.toString());
  }, []);

  const toggleTheme = () => {
    setIsDark(prevIsDark => {
      const newIsDark = !prevIsDark;
      console.log('ThemeContext toggleTheme: Toggling from', prevIsDark, 'to', newIsDark);
      if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
        console.log('ThemeContext toggleTheme: Added dark class, set localStorage to dark.');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
        console.log('ThemeContext toggleTheme: Removed dark class, set localStorage to light.');
    }
      console.log('ThemeContext toggleTheme: document.documentElement.classList:', document.documentElement.classList.toString());
      return newIsDark;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};