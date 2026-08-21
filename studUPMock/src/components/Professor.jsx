import { groupService } from "../api/groups";
import { useEffect, useState } from "react";
import { authService } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, UsersRound, Users, Trophy, FileText, Calendar1, ChartLine} from 'lucide-react';

function ProfHeader( { me, myClasses } ) {
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
                        <h1> {myClasses.groups.length} </h1>
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
        <div className="recapClassCard">
            <div className="line1">
                <div className="recapClassCardLogo" style={{
                    backgroundColor: oneClass.is_active ? "#6EC94633" : "#FF000033",
                    color: oneClass.is_active ? "#6EC946" : "#FF0000", 
                    }}>
                    <UsersRound size={45}/>
                </div>
                <div className="title">
                    <p className="title_className">{oneClass.name}</p>
                    <h3>{oneClass.is_active ? "Active" : "Pas active"}</h3>
                </div>
            </div>
            <div className="line2">
                <div className="line1">
                    <div className="recapClassCardLogo">
                        <Trophy size={35}/>
                    </div>
                    <div className="title">
                        <h4>80%</h4>
                        <p>Moyenne</p>
                    </div>
                </div>
                <div className="line1">
                    <div className="recapClassCardLogo">
                        <Users size={35}/>
                    </div>
                    <div className="title">
                        <p className="title_classText">10</p>
                        <p>Elèves</p>
                    </div>
                </div>
                <div className="line1">
                    <div className="recapClassCardLogo">
                        <FileText size={35} strokeWidth={1.5}/>
                    </div>
                    <div className="title">
                        <p className="title_classText">3</p>
                        <p>Tests</p>
                    </div>
                </div>
            </div>
            <div className="line2">
                <div className="line1">
                    <div className="recapClassCardLogo">
                        <Calendar1 size={35}/>
                    </div>
                    <div className="title">
                        <h4>Dernier test: Pythagore</h4>
                        <p>12/04/2026</p>
                    </div>
                </div>
                <div className="scoreRecap">
                    <ChartLine size={30} style={{color: "#FFAA00c6"}}/>
                    <h2>12/20</h2>
                </div>
            </div>
            <div className="buttonLine">
                <button className="button1">
                    <Users/> <p>Voir les élèves</p>
                </button>
                <button className="button2" onClick={() => navigate(`myclass/${oneClass.group_id}`)}>
                    <UsersRound/> <p>Voir la classe</p>
                </button>
            </div>
        </div>
    </>)
}


const Professor = () => {
    const [me, setMe] = useState(null);
    const [myClasses, setMyClasses] = useState({groups: []});

    useEffect(() =>{
        fetchMyID();
    }, []);

    useEffect(() => {
        fetchMyClasses(me);
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
            console.log("There was an error getting the classes: ", err.response?.data);
        }
    }

    return (
        <>
        <section className="ProfSection">
            <h1>
                Bonjour {me ? me.lastName : null}. 
            </h1>
            <ProfHeader me={me} myClasses={myClasses}/>
            <h1> Mes Classes</h1>
            <div className="RecapMyClasses">    
                {myClasses.groups.map((group, i) => (
                    <ClassRecap oneClass={group}/>
                ))}
            </div>
            
            
                
        </section>
        </>
    )
}

export default Professor;