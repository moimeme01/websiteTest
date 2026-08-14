import { useRef, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from '../api/axios';
import AuthContext, { useAuth } from "../context/AuthProvider";
const LOGIN_URL = '/login';

const Login = (e) => {
    const {setAuth} = useContext(AuthContext);
    const navigate = useNavigate();
    const { login } = useAuth();
    const userRef = useRef("");
    const errRef = useRef("");

    const [user, setUser] = useState("");    
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const [loggedUser, setLoggedUser] = useState('');

    useEffect( () => {
        userRef.current.focus();
    }, [])

    useEffect( () => {
        setErrMsg("");
    }, [user, pwd])

    const handleLogIn = async(e) => {
        e.preventDefault();
        const v1 = user;
        const v2 = pwd;
        if (!v1 || !v2){
            setErrMsg("Invalid Entry !!");
            return;
        }
        try {
            console.log("Searching the DB for the user")
            const response = await axios.post(LOGIN_URL, 
                { username: user, password: pwd },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log("user found in the database.")
            const authUser = response.data.user;
            const authAccessToken = response.data.accessToken;
            console.log(authUser)
            login({
                username: authUser.username,
                role: authUser.role, 
                authorized: authUser.authorized,
                accessToken: authAccessToken,
            });
            console.log("arrived after login.")
            console.log(authUser)
            console.log(authUser.authorised)
            let route;
            if (authUser.authorized){
                if (authUser.role === "admin"){
                    route = "/admin";
                } else if (authUser.role === "Enseignant.e"){
                    route = "/professor"
                } else {
                    route = "/student"
                }
            } else {
                route = "/unauthorizedRoute"
            }
            setLoggedUser(user)
            setUser("");
            setPwd("");
            setSuccess(true);
            console.log("All reset")
            navigate(route);
            console.log("end of try.")
        } catch (err) {
            console.log("There is an error.")
            console.log(err)
            if (!err?.response) {
                console.log(err?.response)
                setErrMsg("No Server Response")
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg("Username not found or password incorrect");
            } else {
                setErrMsg('Login Failed')
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
                
                <button disabled={!user || !pwd}> Sign In </button>
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