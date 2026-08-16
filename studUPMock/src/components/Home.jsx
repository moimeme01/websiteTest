import { Link } from "react-router-dom";

const Home = () => {
    return(
        <>
        <div className="home_layout">
            <div className="home_disclaimer">
                <p>
                    Bienvenue sur la maquette du site StudUp. <br/>
                    Ce site est encore en construction. Vous serez tenu informés lorsque 
                    la version définitive sera mise en ligne.
                </p>
            </div>
            
            <div className="home_text1">
                <p className="home_title">
                    Bienvenue sur <span className="studup"> StudUp</span> !
                </p>
                <p className="home_text">
                    votre espace dédié à la réussite en mathématiques. Connectez-vous pour accéder à l'ensemble de 
                    vos quiz et ainsi suivre vos progrès en toute simplicité. Apprenez à votre rythme, développez votre 
                    logique et progressez chaque jour avec des outils pensés par votre enseignante.<br/>
                </p>
            </div>

            <div className="home_text2">
                <p>
                    StudUp est une plateforme pédagogique innovante dédiée à l'accompagnement des élèves dans 
                    leur apprentissage des mathématiques.
                </p>
                <p>
                    Conçue comme un outil complémentaire aux cours dispensés en classe, elle a pour objectif 
                    de renforcer la compréhension des notions abordées, de stimuler la motivation des élèves et de 
                    favoriser une progression régulière grâce à un environnement numérique moderne, clair et structuré.
                </p>
                <p>               
                    A travers StudUp, les élèves bénéficient de ressources adaptées leur permettant de consolider leurs 
                    acquis, de s'exercer de manière autonome et de suivre leur évolution tout au long de l'année scolaire.
                </p>
                <p>
                    La plateforme propose notamment :
                </p>
                <ul>
                    <li>Des quiz réguliers afin de vérifier la compréhension des matières vues en classe </li>
                    <li>Des accès rapides aux différentes parties du cours à revoir ou approfondir</li>
                    <li>Des synthèses et bilans des évaluations réalisées</li>
                    <li>Un suivi progressif des résultats et des acquis de chaque élève</li>
                </ul>
                
                <p>
                    StudUp s'inscrit pleinement dans une démarche éducative moderne visant à soutenir le travail mené 
                    en classe, à encourager l'autonomie des élèves et à renforcer le lien entre l'école, 
                    les familles et les apprentissages.
                </p>
            </div>
            
            <div className="home_footer">
                <p>
                    <Link to="/login"> Log in </Link>
                </p>
                <p>
                    En revanche, si vous souhaitez demander un accès au site, vous pouez remplir le formulaire
                    d'inscription et je reviendrai vers vous dès que possible. <br/>
                    <Link to="/register"> Demander un accès </Link>
                </p>
            </div>
        </div>
        </>
    );
}


export default Home





