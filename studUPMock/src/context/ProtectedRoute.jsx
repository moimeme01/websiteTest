import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "./AuthProvider"

function ProtectedRoute ( { children } ){
    const { auth } = useAuth();
    if (!auth?.accessToken) {
        return <Navigate to="/login" replace />;
    } 
    return  <Outlet/>;
}
export default ProtectedRoute;