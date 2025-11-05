import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { getStoredAuth, setStoredAuth, clearStoredAuth, isValidToken } from "../hooks/utilsAuth";

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    loading: true,
    error: null
  });

  const initialize = useCallback(async () => {
    try {
      const authData = getStoredAuth();
      
      if (authData && isValidToken(authData.token)) {
        setState({
          user: {
            id: authData.id,
            username: authData.username,
            token: authData.token
          },
          loading: false,
          error: null
        });
      } else {
        clearStoredAuth();
        setState({ user: null, loading: false, error: null });
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      setState({ user: null, loading: false, error: 'Authentication failed' });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const login = useCallback(async (token, username) => {
    try {
      if (!token || !username ) {
        throw new Error('Invalid authentication data');
      }

      const authData = { token, username };
      setStoredAuth(authData);

      setState({
        user: { ...authData },
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Login failed:', error);
      setState(prev => ({
        ...prev,
        error: 'Login failed',
        loading: false
      }));
    }
  }, []);

  const logout = useCallback(() => {
    clearStoredAuth();
    setState({ user: null, loading: false, error: null });
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user: state.user,
        loading: state.loading,
        error: state.error,
        login,
        logout,
        initialize
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};