import {
    BarChart3,
    Bell,
    FileText,
    HelpCircle,
    Home,
    LogOut,
    ShieldCheck,
    Sprout,
    TrendingUp,
    User,
    Zap
} from 'lucide-react';
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { AuthUser } from '../services/authService';

interface SidebarProps {
  isCollapsed: boolean;
  isDarkMode: boolean;
  user: AuthUser | null;
  activePage: string;
  onPageChange: (page: string) => void;
  onSignOut: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  isDarkMode,
  user,
  activePage,
  onPageChange,
  onSignOut
}) => {
  const { t } = useLanguage();

  const menuItems = [
    { id: 'Dashboard', icon: Home, label: t('nav.dashboard') },
    { id: 'Analytics', icon: BarChart3, label: t('nav.analytics') },
    { id: 'Crops', icon: Sprout, label: t('nav.crops') },
    { id: 'Virtual Sensors', icon: Zap, label: 'Virtual Sensors' },
    { id: 'Agriculture News', icon: TrendingUp, label: t('nav.agricultureNews') },
    { id: 'History', icon: FileText, label: t('nav.history') },
    { id: 'Alerts', icon: Bell, label: t('nav.alerts') },
    { id: 'Settings', icon: User, label: t('nav.profile') },
    ...(user && user.role === 'admin' ? [{ id: 'Admin', icon: ShieldCheck, label: 'Admin Panel' }] : []),
    { id: 'Help', icon: HelpCircle, label: t('nav.help') }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => {}} // Prevent closing on overlay click for better UX
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full transition-all duration-300 z-40 ${
        isCollapsed ? 'w-16 md:w-16' : 'w-64 md:w-64'
      } ${
        // On mobile: show/hide based on isCollapsed, on desktop: always show
        isCollapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0'
      } ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Sprout className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-bold text-green-600">SoilSync</h2>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Smart Agriculture
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activePage === item.id
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-600'
                      : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        {user && (
          <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-white" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user.fullName || user.email}
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {user.planType || 'Free Plan'}
                  </p>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <button
                onClick={onSignOut}
                className={`w-full flex items-center space-x-2 mt-3 px-3 py-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">{t('nav.signOut')}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;