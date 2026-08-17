import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function Footer () {
    const { isAuthenticated, logout } = useAuth();
    const  navigate  = useNavigate();

    console.log(isAuthenticated)

    async function handleLogout() {
        await logout(); 
        console.log("Log out successfull !!!")
        navigate("/home");
    }

    return (
        <> 
        <footer className="footer_style">
            <div>
                Ceci sera le footer
            </div>
            <div>
                Composé de plusieurs lignes
            </div>
            <div>
                Et de plusieurs colonnes
            </div>
        </footer>
        </>
    );
}

export default Footer;