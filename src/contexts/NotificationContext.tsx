import React, { createContext, useContext, useEffect, useState } from 'react';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
  read?: boolean;
}

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp'>) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('notifications');
    return stored ? JSON.parse(stored) : [];
  });

  const persist = (list: AppNotification[]) => {
    localStorage.setItem('notifications', JSON.stringify(list));
  };

  const addNotification = (n: Omit<AppNotification, 'id' | 'timestamp'>) => {
    const newNotification: AppNotification = {
      ...n,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      read: false,
    };
    setNotifications(prev => {
      const updated = [newNotification, ...prev.slice(0, 99)]; // keep max 100
      persist(updated);
      return updated;
    });

    // Also trigger browser Notification API if supported & granted
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification(newNotification.title, { body: newNotification.message });
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      persist(updated);
      return updated;
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Expose to non-React code
  useEffect(() => {
    (window as any).addNotification = addNotification;
    return () => {
      delete (window as any).addNotification;
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}; 