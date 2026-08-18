import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function Header () {
    const { user, isAuthenticated, logout } = useAuth();
    const  navigate  = useNavigate();
    const [ isProfessorConnected, setIsProfessorConnected] = useState(false);

    async function handleLogout() {
        navigate("/home", {replace: true});
        await logout(); 
        console.log("Log out successfull !!!")
        
        
    }

    useEffect(() => {
        const isProfessorConnected = async () => {
            console.log("checking if user is connected and a professor: ")
            
            try {
                if (isAuthenticated) { 
                    console.log("is connected")
                    if (user.role === "professor"){
                        console.log("is professor")
                        console.log("check ended")
                        setIsProfessorConnected(true);
                    } else {
                        console.log("is not professor")
                        console.log("check ended")
                        setIsProfessorConnected(true);
                    }
                }
            } catch (error) {
                setIsProfessorConnected(true);
                return error;
            }
        
        }
    }, [isAuthenticated, user?.role]);
    

    return (
        <> 
        <header className="header_style">
            <div className="logo">
                <Link className="logo_title" to="/home"> MATHEMATIQUES </Link>
                <div className="logo_subtitle"> PLATEFORME POUR ELEVES </div>
            </div>
            <div className="header_box_right">
                <Link className="header_link" hidden={isAuthenticated}> A propos </Link>
                <Link className="header_link" hidden={!isProfessorConnected}> Rapport </Link>
                <Link className="header_link" hidden={!isProfessorConnected}> Mes Tests </Link>
                <Link className="header_link" hidden={!isProfessorConnected}> Mes Classes </Link>
                <Link className="header_link" to='/aide'> Aide </Link>
                <Link className="header_link" to="/register" hidden={isAuthenticated}> Nouvel utilisateur </Link>
                <Link className="header_link" to="/login" hidden={isAuthenticated}> Connexion </Link>
                <button className="header_link" onClick={handleLogout} hidden={!isAuthenticated}> Déconnexion </button>
            </div>
        </header>
        </>
    );
}

export default Header;