import { groupService } from "../api/groups";
import { useEffect, useState } from "react";
import { authService } from "../api/auth";
import { Link } from "react-router-dom";
import { GraduationCap } from 'lucide-react';

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
                <Link to="/"> Voir mes classes </Link>
                
            </div>
            <div className="cardProf">
                <div className="cardSummaryAndLogo">
                    <GraduationCap className="graduationLogo" size={55} style={{strokeWidth: 1.5}}/>
                    <div className="cardProfSummary">
                        <h1> {myClasses.groups.length} </h1>
                        <p> tests créés</p>
                    </div>
                </div>
                <Link to="/"> Voir mes tests </Link>
                
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
        <section>
            <h1>
                Bonjour {me ? me.lastName : null}. 
            </h1>

            <ProfHeader me={me} myClasses={myClasses}/>
            
            <div>
                <table className="adminTable">
                    <thead>
                        <tr>
                            <th scope="col"> # </th>
                            <th scope="col"> Nom de la classe </th>
                            <th scope="col"> Ecole </th>
                            <th scope="col"> Active </th>
                        </tr>
                    </thead>
                    <tbody>
                        { myClasses.groups.at(0) == null ? (
                            <td colSpan={3}> You have no classes </td>  
                        ) : (
                            myClasses.groups.map( (group, i) => (
                            <tr key={group.id} style={{backgroundColor: group.is_active ? "#a4f9a1" : "#f9a1a1"}}>
                                <td> {i+1} </td>
                                <td> {group.name} </td>
                                <td> {group.school} </td>
                                <td> {group.is_active ? "Oui" : "Non" } </td>
                            </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
                
        </section>
        </>
    )
}

export default Professor;