import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function Header () {
    const { logout } = useAuth();
    const  navigate  = useNavigate();

    async function handleLogout() {
        await logout(); 
        console.log("Log out successfull !!!")
        navigate("/home");
    }

    return (
        <> 
        <header className="header_style">
            <div className="logo">
                <div className="logo_title"> MATHEMATIQUES </div>
                <div className="logo_subtitle"> PLATEFORME POUR ELEVES </div>
            </div>
            <div className="header_box_right">
                <Link className="header_link" > A propos </Link>
                <Link className="header_link" onClick={null}> Aide </Link>
                <Link className="header_link" to="/register"> Nouvel utilisateur </Link>
                <Link className="header_link" onClick={handleLogout}> Déconnexion </Link>
            </div>
        </header>
        </>
    );
}

export default Header;