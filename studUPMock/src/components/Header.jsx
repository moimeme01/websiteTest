import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function Header () {
    const { user, isAuthenticated, logout } = useAuth();
    const  navigate  = useNavigate();
    const [ isProfessorConnected, setIsProfessorConnected] = useState(false);
    const [ isAdminConnected, setIsAdminConnected] = useState(false);

    async function handleLogout() {
        navigate("/home", {replace: true});
        await logout(); 
        console.log("Log out successfull !!!")
        
        
    }

    useEffect(() => {
        try {
            if (isAuthenticated) { 
                console.log("is connected")
                if (user.role === "professor"){
                    console.log("is professor")
                    console.log("check ended")
                    setIsProfessorConnected(true);
                } else if (user.role === "admin") {
                    console.log("is not professor")
                    console.log("check ended")
                    setIsAdminConnected(true);
                } else {
                    setIsAdminConnected(false);
                    setIsProfessorConnected(false);
                }
            } else {
                setIsAdminConnected(false);
                setIsProfessorConnected(false);
            }
        } catch (error) {
            setIsProfessorConnected(false);
            return error;
        }}, [isAuthenticated, user?.role] 
    );
    

    return (
        <> 
        <header className="header_style">
            <div className="logo">
                <Link className="logo_title" to="/home" hidden={isAuthenticated}> StudUP </Link>
                <Link className="logo_title" to="/admin" hidden={!isAdminConnected}> Admin </Link>
                <Link className="logo_title" to="/professor" hidden={!isProfessorConnected}> Professor </Link>
            </div>
            <div className="header_box_right">
                <Link className="header_link" hidden={isAuthenticated} to="/aide"> A propos </Link>
                <Link className="header_link" hidden={!isProfessorConnected}> Rapport </Link>
                <Link className="header_link" hidden={!isProfessorConnected} to="/professor/mestests"> Mes Tests </Link>
                <Link className="header_link" hidden={!isProfessorConnected} to="/professor/mesclasses"> Mes Classes </Link>
                <Link className="header_link" to='/aide'> Aide </Link>
                <Link className="header_link" to="/register" hidden={isAuthenticated}> Nouvel utilisateur </Link>
                <Link className="header_link" to="/login" hidden={isAuthenticated}> Connexion </Link>
                <button className="header_button" onClick={handleLogout} hidden={!isAuthenticated}> Déconnexion </button>
            </div>
        </header>
        </>
    );
}

export default Header;