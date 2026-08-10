import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "./AuthProvider"

function AdminRoute ({ children }) {
    const { auth } = useAuth();

    if (!auth?.accessToken) {
        return <Navigate to="/login" replace />
    } else if (auth?.accessToken.role == "student") {
        return <Navigate to="/student" replace />
    } else if (auth?.accessToken.role == "professor") {
        return <Navigate to="/professor" replace />
    }

    return <Outlet />
}

export default AdminRoute;