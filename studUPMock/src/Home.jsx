import { useRef, useState, useEffect, useContext } from "react";
import { Link, UNSAFE_createClientRoutesWithHMRRevalidationOptOut } from "react-router-dom";

const Home = () => {
    return(
        <>
        <h1>
            Bonjour,<br/>
            Bienvenue sur la maquette du site StudUp. <br/>
        </h1>
        <h2>
            Ce site est encore en construction. Vous serez tenu informés lorsque la version définitive sera mise en ligne.
        </h2>
        <p>
            Si vous avez l'honneur, que dis-je, le privilège de me connaitre et que vous possédez déjà des identifiants, 
            vous pouvez cliquer sur le lien suivant afin de vous connecter.<br/>
        </p>
        <p>
            <Link to="/login"> Log in</Link>
        </p>
            
        </>
    );
}


export default Home





