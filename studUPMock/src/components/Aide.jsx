

const Aide = () => {
    return (
    <>
        <section className="helpSection">
            <h1>
                Bienvenue sur la page d'aide.
            </h1>
            <div className="helpParagraph">
                <h2> 
                    C'est quoi StudUp?
                </h2>
                <p>
                    StudUP est une plateforme en ligne qui permet aux enseignantes et enseignants d'approfondir 
                    la matière vue en classes grâce à une multitude d'outils mis à la disposition des élèves. 
                </p>
            </div>
            <div className="helpParagraph">
                <h2>Qui peut y avoir accès?</h2>
                <p>
                    Etant donné que le projet est encore à ses débuts, la plateforme n'est actuellement 
                    disponible uniquement pour les élèves de certaines classes 
                    d'une école namuroise.
                </p>
            </div>
            <div className="helpParagraph">
                <h2>Comment je peux accéder à la plateforme?</h2>
                <p>
                    Il y a deux manières d'avoir un compte sur notre plateforme. SI votre professeur ne possède 
                    pas de compte, soyez libre de lui parler du projet afin qu'il puisse créer sa classe et ainsi 
                    y ajouter des élèves. Si en revanche, votre porfesseur possède déja un compte, il devrait déjà 
                    vous avoir ajouté à une de ses classes. Si ce n'est pas le cas, vous devez alors remplir le formulaire 
                    de demande d'accès ou bien demander à votre professeur de vous rajouter à sa classe.
                    <br/>
                    Si toutefois votre professeur n'est pas inscrit mais que vous souhaitez quand même vous créer un 
                    compte, remplissez le formulaire d'enregistrement et nous examinerons cette demande dans les 
                    plus brefs délais. 
                </p>
            </div>
            <div className="helpParagraph">
                <h2>Comment faire si je ne suis pas admis sur le site?</h2>
                <p>
                    Si vous avez remplis le formulaire de demande d'enregistrement et que nous vous avons refusé l'accès,
                    vous pouvez contacter le service client via le formulaire en bas de page et nous vous répondrons 
                    dans les plus brefs délais. <br/> 
                    Si, par contre, vous avez déja introduit une demande d'enregistrement, patientez encore
                    quelques instants, le temps que l'équipe traite la demande. 
                </p>
            </div>
            <div className="helpParagraph">
                <h2>Je ne parviens pas à me connecter. Comment faire?</h2>
                <p>
                    Pour toute demande en lien à votre mot de passe, nom d'utilisateur, mail, classes, professeur, ...
                    contactez nous via le formulaire de contact en bas de page en nous expliquant la demande afin
                    que nous puissions rapidement vous aider.
                </p>
            </div>
        </section>
    </>
    );
}

export default Aide; 