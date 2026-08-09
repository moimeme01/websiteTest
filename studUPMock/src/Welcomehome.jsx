import { useRef, useState, useEffect, useContext } from "react";
import { Link, UNSAFE_createClientRoutesWithHMRRevalidationOptOut } from "react-router-dom";

const Welcomehome = () => {
    return(
        <>
            <p>
                <Link to="/login"> Ok la vanne est drole, retournons au log in</Link>
            </p>
            <h1>
                Okeyyyyy, bienvenue dans ta session. 
                ti é un tigre du bengale. 
            </h1>
        </>
    );
}


export default Welcomehome





