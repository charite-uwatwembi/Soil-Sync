export interface User {
    id: string;
    email: string;
    name: string;
  }
  
  export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
  }
  
  export interface Feature {
    id: string;
    title: string;
    description: string;
    icon: string;
  }
  
  export interface ThemeContextType {
    isDark: boolean;
    toggleTheme: () => void;
  }