import { groupService } from "../api/groups";
import { useEffect, useState } from "react";
import { authService } from "../api/auth";
import { examsService } from "../api/exams";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, UsersRound, Trophy, FileText, CalendarDays, TrendingUp, ArrowRight, Ellipsis} from 'lucide-react';

function ProfHeader( { me, myClasses, myStudents } ) {
    return (
        <>
        <div className="profRecap">
            <div className="cardProf">
                <div className="cardSummaryAndLogo">
                    <GraduationCap className="graduationLogo" size={55} style={{strokeWidth: 1.5}}/>
                    <div className="cardProfSummary">
                        <h1> {myClasses.groups.length} </h1>
                        <p> classes actives</p>
                    </div>
                </div>
                <Link to="" target="_blank"> Voir mes classes </Link>
                
            </div>
            <div className="cardProf">
                <div className="cardSummaryAndLogo">
                    <GraduationCap className="graduationLogo" size={55} style={{strokeWidth: 1.5}}/>
                    <div className="cardProfSummary">
                        <h1> {myClasses.groups.length} </h1>
                        <p> tests créés</p>
                    </div>
                </div>
                <Link to=""> Voir mes tests </Link>
                
            </div>
            <div className="cardProf">
                <div className="cardSummaryAndLogo">
                    <GraduationCap className="graduationLogo" size={55} style={{strokeWidth: 1.5}}/>
                    <div className="cardProfSummary">
                        <h1> {myStudents.users.length} </h1>
                        <p> élèves </p>
                    </div>
                </div>
                <Link to=""> Voir mes élèves </Link>
                
            </div>
            <div className="cardProf">
                <div className="cardSummaryAndLogo">
                    <GraduationCap className="graduationLogo" size={55} style={{strokeWidth: 1.5}}/>
                    <div className="cardProfSummary">
                        <h1> {myClasses.groups.length} </h1>
                        <p> ressources disponibles</p>
                    </div>
                </div>
                <Link to=""> Voir mes classes </Link>
                
            </div>
        </div>
        </>
    );
}

function ClassRecap ({ oneClass }) {
    const  navigate  = useNavigate();
    return (<>
        <div className="class-card">
            <header className="class-card__header">
                <div className="class-card__identity">
                <div className="class-card__icon class-card__icon--coral" style={{
                        backgroundColor: oneClass.is_active ? "#eaffe7" : "#ffe9e7",
                        color: oneClass.is_active ? "#60ef5b" : "#ef665b",
                    }}>
                    <UsersRound size={22} />
                </div>

                <div>
                    <div className="class-card__title-row">
                    <h2 className="class-card__title">{oneClass.name}</h2>
                    </div>
                    <span className="class-card__status" style={{
                        borderColor: oneClass.is_active ? "#d6f2d1" : "#f2d5d1",
                        backgroundColor: oneClass.is_active ? "#f6fff6" : "#fff7f6",
                        color: oneClass.is_active ? "#52bd48" : "#bd5148",
                    }}>{oneClass.is_active ? "Active" : "Inactive"}</span>
                </div>
                </div>

                <button className="class-card__menu" aria-label="Options de la classe">
                <Ellipsis size={20} />
                </button>
            </header>

            <section className="class-card__stats">
                <div className="class-stat">
                <div className="class-stat__top">
                    <Trophy size={18} />
                    <span className="class-stat__value">80%</span>
                </div>
                <span className="class-stat__label">Moyenne</span>
                </div>

                <div className="class-stat">
                <div className="class-stat__top">
                    <UsersRound size={18} />
                    <span className="class-stat__value">{oneClass.student?.length}</span>
                </div>
                <span className="class-stat__label">Élèves</span>
                </div>

                <div className="class-stat">
                <div className="class-stat__top">
                    <FileText size={18} />
                    <span className="class-stat__value">3</span>
                </div>
                <span className="class-stat__label">Tests</span>
                </div>
            </section>

            <section className="class-card__test">
                <div className="class-card__test-icon">
                <CalendarDays size={20} />
                </div>

                <div className="class-card__test-details">
                <p className="class-card__eyebrow">Dernier test</p>
                <h3 className="class-card__test-title">Pythagore</h3>
                <p className="class-card__date">12/04/2026</p>
                </div>

                <div className="class-card__score">
                <TrendingUp size={18} />
                <span>12/20</span>
                </div>
            </section>

            <footer className="class-card__actions">
                <button className="class-card__button button--secondary">
                <UsersRound size={18} />
                Voir les élèves
                </button>

                <button className="class-card__button button--primary" onClick={() => navigate(`myclass/${oneClass.group_id}`)}>
                <ArrowRight size={18} />
                Voir la classe
                </button>
            </footer>
        </div>

    </>)
}


const Professor = () => {
    const [me, setMe] = useState(null);
    const [myClasses, setMyClasses] = useState({groups: []});
    const [myTests, setMyTests] = useState({tests: []});
    const [myStudents, setMyStudents] = useState({users: []});

    useEffect(() =>{
        fetchMyID();
    }, []);

    useEffect(() => {
        fetchMyClasses(me);
        fetchMyUsers(me);
        fetchMyTests(me);
    }, [me]);

    async function fetchMyID(){
        try {
            console.log("Trying to get my ID...")
            const response = await authService.get_profile();
            console.log("I am: ", response)
            setMe(response);
            return response;
        } catch (err) {
            console.log("Error getting my ID: ", err);
        }
    }

    async function fetchMyClasses(me) {
        try {
            console.log("Fetching my classes...")
            const id = me.id;
            console.log(me)
            console.log(id)
            const result = await groupService.getMyClassrooms(id);
            setMyClasses(result.data);
        } catch (err) {
            console.log("There was an error getting the classes: ", err);
        }
    }

    async function fetchMyTests(me) {
        try {
            console.log("Getting my tests ... ");
            const id = me.id;
            const result = await examsService.getMyTests(id);
            console.log(result)
            setMyTests(result.data);
        } catch (err) {
            console.log("Error getting my tests: ", err)
        }
    }

    async function fetchMyUsers(me){
        try {
            const id = me.id;
            console.log("me is ", me)
            console.log("my id is ", id)
            const result = await authService.getMyStudents(id);
            console.log(result)
            setMyStudents(result)
        } catch (err) {
            console.log("There was an error getting my students: ", err)
        }
    }

    return (
        <>
        <section className="ProfSection">
            <h1>
                Bonjour {me ? me.lastName : null}. 
            </h1>
            <ProfHeader me={me} myClasses={myClasses} myStudents={myStudents}/>
            <h1> Mes Classes</h1>
            <div className="RecapMyClasses">    
                {myClasses.groups.map((group, i) => (
                    <ClassRecap oneClass={group}/>
                ))}
            </div>
            <h1> Mes Tests</h1>
            <div className="RecapMyClasses">    
                {myTests.tests?.map((tests, i) => (
                    <ClassRecap oneClass={tests}/>
                ))}
            </div>
            
        </section>
        </>
    )
}

export default Professor;