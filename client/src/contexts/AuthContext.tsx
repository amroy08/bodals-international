import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../api/authApi';

interface AuthData {
  token: string | null;
  admin: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthData>({
  token: null, admin: null, loading: true,
  login: async () => ({ success: false, message: '' }),
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('bodals_token'));
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      authApi.getMe()
        .then(res => setAdmin(res.data.data))
        .catch(() => { setToken(null); localStorage.removeItem('bodals_token'); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await authApi.login(email, password);
      const { token: newToken, admin: adminData } = res.data.data;
      localStorage.setItem('bodals_token', newToken);
      setToken(newToken);
      setAdmin(adminData);
      return { success: true, message: 'Login successful' };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('bodals_token');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ token, admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
