import { useEffect, useState } from 'react';
import { getCurrentUser } from '../api/auth.api';
import { AuthContext } from './authContextUtils';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  window.authUser = user; // DEBUG: Expose user to window

  useEffect(() => {
    const checkuser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData.data);
      } catch (error) {
        console.error("not logged in", error);
        setUser(null);

      } finally {
        setLoading(false);
      }
    };
    checkuser();
  }, []);

  const Login = (userData) => {
    setUser(userData);
  };

  const Logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
  };

  return (
    <AuthContext.Provider value={
      { user, loading, Login, Logout }
    }>
      {!loading && children}
    </AuthContext.Provider>
  )

}
