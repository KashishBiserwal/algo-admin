import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setCookie = (name: string, value: string, options?: any) => {
    Cookies.set(name, value, options);
  };

  const removeCookie = (name: string, options?: any) => {
    Cookies.remove(name, options);
  };

  const getCookie = (name: string): string | undefined => {
    return Cookies.get(name);
  };

  useEffect(() => {
    const verifyAuth = async () => {
      setLoading(true);
      try {
        const token = getCookie('auth_token');
        console.log('🔍 Verifying auth with token:', token ? 'exists' : 'missing');
        
        if (token) {
          const response = await axios.get('http://localhost:4000/api/auth/admin/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log('🔍 Auth verification response:', response.data);
          
          if (response.data.success) {
            setUser(response.data.user);
            setIsAuthenticated(true);
            console.log('✅ Auth verification successful');
          } else {
            throw new Error('Invalid response');
          }
        } else {
          console.log('❌ No token found');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err: any) {
        console.error('❌ Auth verification failed:', err.response?.data || err.message);
        removeCookie('auth_token');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:4000/api/auth/admin-register', {
        name,
        email,
        password
      });
      
      setCookie('auth_token', response.data.token, { 
        expires: 7, 
        secure: false, // Set to true in production with HTTPS
        sameSite: 'lax' 
      });
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔐 Attempting admin login for:', email);
      const response = await axios.post('http://localhost:4000/api/auth/admin-login', {
        email,
        password
      });
      
      console.log('🔐 Login response:', response.data);
      
      setCookie('auth_token', response.data.token, { 
        expires: 7, 
        secure: false, // Set to true in production with HTTPS
        sameSite: 'lax',
        path: '/' // Ensure cookie is available for all paths
      });
      
      console.log('🍪 Cookie set:', getCookie('auth_token') ? 'success' : 'failed');
      setUser(response.data.user);
      setIsAuthenticated(true);
      console.log('✅ Login successful');
    } catch (err: any) {
      console.error('❌ Login failed:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeCookie('auth_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      register, 
      logout,
      loading,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
};