import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "./AuthContext"

function AdminRoute ({ children }) {
    const { user, loading } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />
    } else if (user.role == "student") {
        return <Navigate to="/student" replace />
    } else if (user.role == "professor") {
        return <Navigate to="/professor" replace />
    }

    return <Outlet />
}

export default AdminRoute;