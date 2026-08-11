import { Link } from "react-router-dom";

const UnauthorizedRoute = (e) => {
    return (
        <> 
        <section>
            <h1>
                Mmmhhhh! <br/>
                <br/>
                It's seems like you have not been authorized yet to enther the website.
            </h1>
            <p> 
                Vous n'avez pas encore été autorisés a accéder au site studUP. Cette restriction est nécesaire afin de
                prévenir notre serveur d'utilisateurs malveillants. Si vous avez déjà rempli le formulaire 
                d'enregistrement vous devez attendre encore quelques instants afin que votre demande soit acceptée. <br/>
                Si vous avez besoin rapidement d'un accès, veuillez vous rendre dans la section contact du site.<br/>
                Si, en revanche, vous n'avez pas encore demandé l'accès au site, veuillez compléter le formulaire afin d
                débloquer un accès. 
            </p>
            <Link to='/register'> Demander un accès </Link>
        </section>
        
        </>
    );
}


export default UnauthorizedRoute;