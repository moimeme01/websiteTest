import { Navigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({children }) => {
    const [auth, setAuth] = useState(null);
    const login = (user) => {
        setAuth(user);
    };
    const logout = () => {
        setAuth(null)
    };
    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context){ throw new Error ("useAuth must be used inside an auth provider");}

    return context;
};

export default AuthContext;
