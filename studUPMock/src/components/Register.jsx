import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../context/AuthContext";

const FIRSTNAME_REGEX = /^[A-Z][a-z]{2,19}$/;
const LASTNAME_REGEX = /^[A-Z][a-z]{2,19}$/;
const USERNAME_REGEX = /^[A-Za-z][A-Za-z0-9_-]*.{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z]).{1,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const REGISTER_URL = '/register';

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const { register } = useAuth(); 

    const [firstName, setFirstName] = useState('');
    const [validFirstName, setValidFirstName] = useState(false);
    const [firstNameFocus, setFirstNameFocus] = useState(false);

    const [lastName, setLastName] = useState('');
    const [validLastName, setValidLastName] = useState(false);
    const [lastNameFocus, setLastNameFocus] = useState(false);

    const [userName, setUserName] = useState('');
    const [validUserName, setValidUserName] = useState(false);
    const [userNameFocus, setUserNameFocus] = useState(false);
    
    const [registeredUser, setRegisteredUser] = useState("");

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);
    
    const [role, setRole] = useState(""); 
    const [teacher, setTeacher] = useState("");
    const [school, setSchool] = useState("");
    const [classroom_id, setClassroom] = useState(0);
    const [groups, setGroups] = useState("");

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidFirstName(FIRSTNAME_REGEX.test(firstName));
    }, [firstName])

    useEffect(() => {
        setValidLastName(LASTNAME_REGEX.test(lastName));
    }, [lastName])

    useEffect(() => {
        setValidUserName(USERNAME_REGEX.test(userName));
    }, [userName])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        setErrMsg('');
    }, [userName, pwd, matchPwd, email])

    const fetchGroups = async () => {
        try {
            const response = await api.get("/groups/list");
            setGroups(response.data);
        } catch (error) {
            console.log("Could not find the classes", error.response)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = USERNAME_REGEX.test(userName);
        const v2 = PWD_REGEX.test(pwd);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            console.log("trying to register")

            const response = await register(
                { 
                    firstName: firstName,
                    lastName: lastName,
                    username: userName, 
                    password: pwd,
                    email: email,
                    role: role,
                    classroom: classroom_id,
                    school: school,
                    professor: teacher
                },
            );

            console.log("finished the register.")
            setSuccess(true);
            setRegisteredUser(userName);
            //clear state and controlled inputs
            //need value attrib on inputs for this
            setUserName('');
            setFirstName('');
            setLastName('');
            setPwd('');
            setMatchPwd('');
            setEmail('');
            setRole('');
            setClassroom('');
            setSchool('');
            setTeacher('');

        } catch (err) {
            console.log(err)
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                const detail = err.response?.data?.detail;
                setErrMsg(detail?.message || 'Username already taken.');
            } else {
                setErrMsg(err.response?.data?.detail?.message || 'Registration Failed')
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>Bien joué!</h1>
                    <p> Ta demande de création de compte a bien été envoyée à l'administarteur du site. Surveille tes mails afin de voir si ta demande a été acceptée. </p>
                    <p>
                        <Link to="/home">Go back home</Link>
                    </p>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <p> Ici, vous pouvez demander un compte StudUp. Ce compte vous donnera accès 
                        à toutes les ressources mises à disposition par vos enseignantes et enseignants inscrits sur le site.
                        Une fois le formulaire rempli, votre demande sera soumise et analysée par l'équipe. Veillez à 
                        ce que toutes vos données soient correctes et plus particulièrement votre adresse 
                        e-mail, car c'est via cette dernière que les communications telles que acceptation de votre compte, 
                        nouveaux tests disponibles, résultats disponibles, etc. vous seront communiquées.
                    </p>
                    <form onSubmit={handleSubmit} className="register-form">
                        <h1> Enregistrement </h1>
                        <fieldset className="form-section">
                            <legend> Informations personnelles </legend>

                            <div className="form-field">
                                <label htmlFor="lastname">
                                    Nom:
                                    <FontAwesomeIcon icon={faCheck} className={validLastName ? "valid" : "hide"} />
                                    <FontAwesomeIcon icon={faTimes} className={validLastName || !lastName ? "hide" : "invalid"} />
                                </label>
                                <input 
                                    type="text"
                                    id="lastname"
                                    name="lastname"
                                    ref={userRef}
                                    autoComplete="family-name"
                                    onChange={(e) => setLastName(e.target.value)}
                                    value={lastName}
                                    required
                                    aria-invalid={validLastName ? "false" : "true"}
                                    aria-describedby="lastnamenote"
                                    onFocus={() => setLastNameFocus(true)}
                                    onBlur={() => setLastNameFocus(false)}
                                />
                                <p id="lastnamenote" className={lastNameFocus && lastName && !validLastName ? "instructions" : "offscreen"}>
                                    <FontAwesomeIcon icon={faInfoCircle} /> 
                                    Doit commencer par une majuscule. <br/>
                                    Ne peut contenir que des lettres (minuscules à partir de la deuxième).<br/>
                                    Doit contenir au maximum 20 caractères.
                                </p>
                            </div>

                            <div className="form-field">
                                <label htmlFor="firstname">
                                    Prénom:
                                    <FontAwesomeIcon icon={faCheck} className={validFirstName ? "valid" : "hide"} />
                                    <FontAwesomeIcon icon={faTimes} className={validFirstName || !firstName ? "hide" : "invalid"} />
                                </label>
                                <input 
                                    type="text"
                                    id="firstname"
                                    name="firstname"
                                    autoComplete="given-name"
                                    onChange={(e) => setFirstName(e.target.value)}
                                    value={firstName}
                                    required
                                    aria-invalid={validFirstName ? "false" : "true"}
                                    aria-describedby="firstnamenote"
                                    onFocus={() => setFirstNameFocus(true)}
                                    onBlur={() => setFirstNameFocus(false)}
                                />
                                <p id="firstnamenote" className={firstNameFocus && firstName && !validFirstName ? "instructions" : "offscreen"}>
                                    <FontAwesomeIcon icon={faInfoCircle} /> 
                                    Doit commencer par une majuscule. <br/>
                                    Ne peut contenir que des lettres (minuscules à partir de la deuxième).<br/>
                                    Doit contenir au maximum 20 caractères.
                                </p>
                            </div>

                            <div className="form-field">
                                <label htmlFor="username">
                                    Nom d'utilisateur:
                                    <FontAwesomeIcon icon={faCheck} className={validUserName ? "valid" : "hide"} />
                                    <FontAwesomeIcon icon={faTimes} className={validUserName || !userName ? "hide" : "invalid"} />
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    autoComplete="username"
                                    onChange={(e) => setUserName(e.target.value)}
                                    value={userName}
                                    required
                                    aria-invalid={validUserName ? "false" : "true"}
                                    aria-describedby="uidnote"
                                    onFocus={() => setUserNameFocus(true)}
                                    onBlur={() => setUserNameFocus(false)}
                                />
                                <p id="uidnote" className={userNameFocus && userName && !validUserName ? "instructions" : "offscreen"}>
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    Doit contenir entre 4 et 24 caractères.<br />
                                    Doit commencer avec une lettre.<br />
                                    Caractères autorisés: lettres, chiffres, _ , - .<br />
                                    Tout autre caractère n'est pas autorisé, y compris les espaces.
                                </p>
                            </div>
                            <div className="form-field">
                                <label htmlFor="email">
                                    Adresse e-mail
                                    <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                                    <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    autoComplete="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    value={email}
                                    aria-invalid={validEmail ? "false" : "true"}
                                    aria-describedby="emailnote"
                                    onFocus={() => setEmailFocus(true)}
                                    onBlur={() => setEmailFocus(false)}
                                />
                                <p id="emailnote" className={email && emailFocus && !validEmail ? "instructions" : "offscreen"}>
                                    Doit respecter un format d'adresse mail valide, par exemple: example@email.com
                                </p>
                            </div>

                        </fieldset>
                        
                        <fieldset className="form-section">
                            <legend> Sécurité </legend>

                            <div className="form-field">
                                <label htmlFor="password">
                                    Password:
                                    <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                                    <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    autoComplete="new-password"
                                    onChange={(e) => setPwd(e.target.value)}
                                    value={pwd}
                                    required
                                    aria-invalid={validPwd ? "false" : "true"}
                                    aria-describedby="pwdnote"
                                    onFocus={() => setPwdFocus(true)}
                                    onBlur={() => setPwdFocus(false)}
                                />
                                <p id="pwdnote" className={pwdFocus && pwd && !validPwd ? "instructions" : "offscreen"}>
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    Doit contenir entre 8 et 24 caractères<br />
                                    Doit inculre au minimum une majuscule, une minuscule, un chiffre et un caractère spécial.<br />
                                    caractères spéciaux authorisés: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                                </p>
                            </div>

                            <div className="form-field">
                                <label htmlFor="confirm_pwd">
                                    Confirm Password:
                                    <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                                    <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                                </label>
                                <input
                                    type="password"
                                    id="confirm_pwd"
                                    name="confirmPassword"
                                    autoComplete="new-password"
                                    onChange={(e) => setMatchPwd(e.target.value)}
                                    value={matchPwd}
                                    required
                                    aria-invalid={validMatch ? "false" : "true"}
                                    aria-describedby="confirmnote"
                                    onFocus={() => setMatchFocus(true)}
                                    onBlur={() => setMatchFocus(false)}
                                />
                                <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    Doit correspondre au mot de passe précédent.
                                </p>
                            </div>

                        </fieldset>
                        
                        <fieldset className="form-section">
                            <legend> Rôle </legend>
                            <div className="radio-group">
                                <label htmlFor="professor-role">
                                    <input
                                        type="radio"
                                        name="role"
                                        id="professor-role"
                                        checked={role === "professor"}
                                        onChange={(e) => setRole(e.target.value)}
                                        value="professor"
                                        required
                                    />
                                    Enseignant•e
                                </label>
                                <label htmlFor="student-role">
                                    <input
                                        type="radio"
                                        id="student-role"
                                        name="role"
                                        checked={role === "student"}
                                        onChange={(e) => setRole(e.target.value)}
                                        value="student"
                                    />
                                    Etudiant•e
                                </label>
                            </div>
                        </fieldset>

                        <fieldset className="form-section">
                            <legend> Informations complémentaires </legend>
                            <div className="form-field">
                                <label htmlFor="class-select">
                                    Classe:
                                </label>
                                <select 
                                    name="class" 
                                    id="class-select" 
                                    value={classroom_id}

                                    onChange={(e) => setClassroom(e.target.value)}
                                    >
                                    <option value=""> -- Choisissez une classe -- </option>
                                    {groups.map(group => {

                                        <option key={group.group_id} value={group.group_id}> {group.name} </option>
                                    })}
                                </select>
                            </div>
                            <div className="form-field">
                                <label htmlFor="school-select">
                                    Ecole:
                                </label>
                                <select name="school" id="school-select" value={school} onChange={(e) => {setSchool(e.target.value)}}>
                                    <option value=""> -- Choisissez une école -- </option>
                                    <option value="ITN"> ITN </option>
                                </select>
                            </div>
                            <div className="form-field">
                                <label htmlFor="prof-select">
                                    Professeur:
                                </label>
                                <select name="professor" id="prof-select" value={teacher} onChange={(e) => setTeacher(e.target.value)} disabled={role==="professor"}>
                                    <option value=""> -- Choisissez un professeur -- </option>
                                    <option value="GColaux"> G. Colaux </option>
                                </select>
                            </div>
                        </fieldset>
                        
                        <button className="form-button" disabled={!validLastName || !validFirstName || !validUserName || !validPwd || !validMatch || !validEmail || !role}>Sign Up</button>
                    </form>
                    <p>
                        Already registered?<br />
                        <span className="line">
                            <Link to="/login">Sign In</Link>
                        </span>
                    </p>
                </section>
            )}
        </>
    )
}

export default Register