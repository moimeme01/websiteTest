import { createContext, useState, useContext, useEffect, useReducer } from "react";
import { authService } from "../api/auth";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if the user is already connected
        const checkAuth = async () => {
            const token = localStorage.getItem("access_token");

            if (!token) {
                setLoading(false);
                return;
            }

            try { // Check the token with /users/me
                const userData = await authService.getProfile();
                setUser(userData);
            } catch (error) {
                // Invalid or expired token 
                localStorage.removeItem("access_token");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);


    const login = async (username, password) => {
        const data = await authService.login(username, password);
        const userdata = await authService.getProfile();
    }

    const register = async (userData) => {
        const response = await authService.register(userData);
        return response;
    }

    const logout = async () => {
        await authService.logout();
        setUser(null);
    }

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout
    };
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );

}


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};