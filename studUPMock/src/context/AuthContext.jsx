import { createContext, useState, useContext, useEffect, useReducer } from "react";
import { authService } from "../api/auth";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasLoggedOut, setHasLoggedOut] = useState(false);

    useEffect(() => {
        console.log("user updated:", user);
    }, [user]);


    useEffect(() => {
        // Check if the user is already connected
        const restoreUser = async () => {
            try { // Check the token with /users/me
                const userData = await authService.restoreSession();
                console.log("trying to restore the session")
                if (userData) {
                    console.log("founded one user ", userData)
                    setUser(userData);
                } else {
                    setUser(null);
                }
            } finally {
                setLoading(false);
            }
        };

        restoreUser();
    }, []);


    const login = async (username, password) => {
        await authService.login(username, password);
        const userdata = await authService.get_profile();
        setUser(userdata);
        console.log("User loaded after refresh:", userdata);

        return userdata;
    }

    const register = async (userData) => {
        const response = await authService.register(userData);
        return response;
    }

    const unauthorized = async () => {
        const response = await authService.get_pending_users();
        return response;
    }

    const authorized = async () => {
        const response = await authService.get_authorized_users();
        return response;
    }

    const authorization = async (listOfUsers) => {
        const response = await authService.authorizing_users(listOfUsers);
        return response;
    }
    
    const logout = async () => {
        console.log("We are going to try")
        try {
            await authService.logout();
            localStorage.removeItem("access_token");
            setUser(null);
        } catch (error) {
            console.log("Logout request faied with error code: ", error);
        } finally {
            localStorage.removeItem("access_token");
            setUser(null);
            setHasLoggedOut(true);
        }
    }

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        unauthorized,
        authorized,
        authorization,
        logout,
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