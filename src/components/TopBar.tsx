import { Bell, Globe, LogOut, Menu, Moon, Search, Sun, User } from 'lucide-react';
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotifications } from '../contexts/NotificationContext';
import type { AuthUser } from '../services/authService';

interface TopBarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  user: AuthUser | null;
  onSignIn: () => void;
  onSignOut: () => void;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const TopBar: React.FC<TopBarProps> = ({
  isCollapsed,
  setIsCollapsed,
  isDarkMode,
  toggleDarkMode,
  user,
  onSignIn,
  onSignOut,
  toggleSidebar,
  isSidebarOpen
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { unreadCount, markAllAsRead } = useNotifications();

  return (
    <div className={`fixed top-0 right-0 left-0 z-50 h-16 ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } border-b transition-all duration-300 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Left side - Toggle and Title */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <h1 className="text-lg md:text-xl font-semibold truncate">{t('dashboard.title')}</h1>
            <p className={`text-xs md:text-sm hidden sm:block ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('dashboard.subtitle')}
            </p>
          </div>
        </div>

        {/* Right side - Search, Language Toggle, Dark Mode Toggle, Notifications, User */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Search - Hidden on mobile and small tablets */}
          <div className="relative hidden xl:block">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search..."
              className={`pl-10 pr-4 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-48 xl:w-64`}
            />
          </div>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            title={language === 'en' ? 'Switch to Kinyarwanda' : 'Switch to English'}
          >
            <div className="flex items-center space-x-1">
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium hidden sm:inline">
                {language === 'en' ? 'EN' : 'RW'}
              </span>
            </div>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600" />
            )}
          </button>

          {/* Notifications - Hidden on small screens */}
          <button
            onClick={markAllAsRead}
            className={`p-2 rounded-lg transition-colors hidden sm:block ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            title={unreadCount ? `${unreadCount} unread` : 'No notifications'}
          >
            <div className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
          </button>

          {/* User Menu */}
          {user ? (
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium hidden md:inline truncate max-w-32">
                  {user.fullName || user.email}
                </span>
              </div>
              <button
                onClick={onSignOut}
                className={`text-xs md:text-sm px-2 md:px-3 py-1 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="hidden sm:inline">{t('nav.signOut')}</span>
                <LogOut className="h-4 w-4 sm:hidden" />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="bg-green-600 hover:bg-green-700 text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors"
            >
              {t('auth.signIn')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;