import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function Header () {
    const { user, isAuthenticated, logout } = useAuth();
    const  navigate  = useNavigate();

    async function handleLogout() {
        navigate("/home", {replace: true});
        await logout(); 
        console.log("Log out successfull !!!")
        
        
    }

    async function isProfessor(){
        try {
            if (user.role === "professor"){
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }
    return (
        <> 
        <header className="header_style">
            <div className="logo">
                <Link className="logo_title" to="/home"> MATHEMATIQUES </Link>
                <div className="logo_subtitle"> PLATEFORME POUR ELEVES </div>
            </div>
            <div className="header_box_right">
                <Link className="header_link" hidden={isAuthenticated}> A propos </Link>
                <Link className="header_link" hidden={!isAuthenticated || !isProfessor}> Rapport </Link>
                <Link className="header_link" hidden={!isAuthenticated || !isProfessor}> Mes Tests </Link>
                <Link className="header_link" hidden={!isAuthenticated || !isProfessor}> Mes Classes </Link>
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