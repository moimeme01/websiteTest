import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "./AuthContext"

function ProfessorRoute ( { children } ){
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Chargement...</div>;
    }
    try {
        if (user.authorized === false) {
            return <Navigate to="/unauthorized" replace />;
        } else if (user.role !== "professor") {
            return <Navigate to="/student" replace />;
        } 
    } catch (error) {
        return <Navigate to="/home" replace/>;
    }
    
    return  <Outlet/>;
}
export default ProfessorRoute;