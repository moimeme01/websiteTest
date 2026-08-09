import { useRef, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from './api/axios';
import AuthContext from "./context/AuthProvider";

const LOGIN_URL = '/login';

const Login = (e) => {
    const {setAuth} = useContext(AuthContext);
    const userRef = useRef("");
    const errRef = useRef("");

    const [user, setUser] = useState("");    
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const [registeredUser, setRegisteredUser] = useState('');

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
            console.log(JSON.stringify(response?.data));
            const accessToken = response?.data?.accessToken;
            setAuth( {user, pwd, accessToken });
            setRegisteredUser(user)
            setUser("");
            setPwd("");
            setSuccess(true);

        } catch (err) {
            if (!err?.response) {
                setErrMsg("No Server Response")
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg(err.response?.data);
            } else {
                setErrMsg('Login Failed')
            }
            errRef.current.focus();
        }
    }

    return (
        <>
        { success ? (
            <p>
                <Link to='/WELCOMEHOME'>WELCOME HOME BUDDY !!!!!!!!!!</Link>
            </p>
        ) : (
            <section>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive"> {errMsg} </p>
                <h1>
                    Log In
                </h1>
                <form onSubmit={handleLogIn}>
                    <label htmlFor="username">
                        Username
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
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        autoComplete="off"
                        onChange={e => setPwd(e.target.value)}
                        value={pwd}
                        required
                    />
                    <button disabled={!user || !pwd}> Sign In </button>
                </form>
                <p>
                    Don't have an account?<br/>
                    <span className="line">
                        <Link to="/register">Sign Up</Link>
                    </span>
                    
                </p>

            </section>
        
        )}
        </>
    )
}

export default Login