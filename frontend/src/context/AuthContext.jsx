import React, { createContext, useContext, useEffect, useState } from 'react'
import { getProfile, loginUser, logoutUser, registerUser } from '../services/authServices'

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setuser] = useState(null);
    const [loading, setloading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem("token");
        if(!token){
            setloading(false);
            return;
        }
        getProfile()
        .then((data) => setuser(data.user || data))
        .catch(() => {
          localStorage.removeItem("token");
          setuser(null);
        })
        .finally(() => setloading(false));
    }, []);


    const login = async (credentials) => {
        const data = await loginUser(credentials); // { token, user }
        setuser(data.user);
        return data;
      };
    
      const register = async (payload) => {
        const data = await registerUser(payload);
        return data;
      };
    
      const logout = async () => {
        try {
          await logoutUser();
        } catch {}
        localStorage.removeItem("token");
        setuser(null);
      };
    
      const value = {
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        setuser,
      };
    
      return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    };
    
    export const useAuth = () => useContext(AuthContext);