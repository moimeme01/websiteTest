import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "./AuthContext"

function StudentRoute ( { children } ){
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Chargement...</div>;
    }
    
    if (user.authorized === false) {
        return <Navigate to="/unauthorized" replace />;
    } else if (user.role !== "student") {
        return <Navigate to="/professor" replace />;
    } 
    return  <Outlet/>;
}
export default StudentRoute;