import { useRef, useState, useEffect, useContext } from "react";
import { Link , useNavigate} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LOGIN_URL = '/login';

const Login = (e) => {
 
    const navigate = useNavigate();
    const { login } = useAuth();
    const userRef = useRef("");
    const errRef = useRef("");

    const [user, setUser] = useState("");    
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect( () => {
        userRef.current.focus();
    }, []);

    useEffect( () => {
        setErrMsg("");
    }, [user, pwd]);

    const handleLogIn = async(e) => {
        e.preventDefault();
        const v1 = user;
        const v2 = pwd;
        if (!v1 || !v2){
            setErrMsg("Invalid Entry !!");
            return;
        }
        try {
            const response = await login(user, pwd);
            let route;
            if (response.authorized){
                if (response.role === "admin"){
                    route = "/admin";
                } else if (response.role === "professor"){
                    document.cookie = `prof_id=${encodeURIComponent(response.id)}; Max-Age=${7 * 24 * 60 * 60}; Path=/; SameSite=Strict`;
                    route = "/professor"
                } else {
                    document.cookie = `student_id=${encodeURIComponent(response.id)}; Max-Age=${7 * 24 * 60 * 60}; Path=/; SameSite=Strict`;
                    route = "/student"
                }
            } else {
                route = "/unauthorizedRoute"
            }
            setUser("");
            setPwd("");
            setSuccess(true);
            navigate(route);
        } catch (err) {
            console.log("There is an error: ", err.response?.data?.detail);
            if (err?.response?.data) {
                if (err.response?.data?.detail) {
                    setErrMsg(err.response?.data?.detail)
                } else {
                    setErrMsg(err.response?.data)
                }
            }
            errRef.current.focus();
        }
    }

    return (
        <>
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive"> {errMsg} </p>
            <h1>
                Log In
            </h1>
            <form className="login-form" onSubmit={handleLogIn}>
                <fieldset className="login-set">
                    <label htmlFor="username">
                        Username:
                    </label>
                    <input
                        type="text"
                        id="username"
                        ref={userRef}
                        autoComplete="off"
                        onChange={e => setUser(e.target.value)}
                        value={user}
                        required
                    />
                    <label htmlFor="username">
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        autoComplete="off"
                        onChange={e => setPwd(e.target.value)}
                        value={pwd}
                        required
                    />
                </fieldset>
                
                <button className={"button--primary"} disabled={!user || !pwd}> Sign In </button>
            </form>
            <p>
                Don't have an account?<br/>
                Ask now to create your account.<br/>
                <span className="line">
                    <Link to="/register">Ask for an account</Link>
                </span>
                
            </p>

        </section>
        </>
    )
};

export default Login;