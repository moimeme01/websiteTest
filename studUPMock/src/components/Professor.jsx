import { groupService } from "../api/groups";
import { useEffect, useState, useRef } from "react";
import { authService } from "../api/auth";
import { examsService } from "../api/exams";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Gauge, UsersRound, Trophy, FileText, CalendarDays, TrendingUp, ArrowRight, Ellipsis, TriangleRight, FileQuestionMark} from 'lucide-react';

function convertDate(date){
    const interDate = new Date(date)
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour:'2-digit',
        minute:'2-digit',
        hour12: false
    }).format(interDate).replace(',', ' ')
    return formattedDate
}




function ProfHeader( { myClasses, myStudents, myTests } ) {
    return (
        <>
        <div className="profRecap">
            <div className="cardProf">
                <div className="cardSummaryAndLogo">
                    <GraduationCap className="graduationLogo" size={55} style={{strokeWidth: 1.5}}/>
                    <div className="cardProfSummary">
                        <h1> {myClasses.groups.length} </h1>
                        <p> {myClasses.groups.length == 1 ? "Classe" : "Classes"} </p>
                    </div>
                </div>
                <Link to="mesclasses"> Voir mes classes </Link>
                
            </div>
            <div className="cardProf">
                <div className="cardSummaryAndLogo">
                    <GraduationCap className="graduationLogo" size={55} style={{strokeWidth: 1.5}}/>
                    <div className="cardProfSummary">
                        <h1> {myTests.exams.length} </h1>
                        <p> {myTests.exams.length == 1 ? "Test créé" : "Tests créés"}</p>
                    </div>
                </div>
                <Link to="mestests"> Voir mes tests </Link>
                
            </div>
            <div className="cardProf">
                <div className="cardSummaryAndLogo">
                    <GraduationCap className="graduationLogo" size={55} style={{strokeWidth: 1.5}}/>
                    <div className="cardProfSummary">
                        <h1> {myStudents.users.length} </h1>
                        <p> {myStudents.users.length == 1 ? "Élève" : "Élèves"} </p>
                    </div>
                </div>
                <Link to=""> Voir mes élèves </Link>
                
            </div>
            <div className="cardProf">
                <div className="cardSummaryAndLogo">
                    <GraduationCap className="graduationLogo" size={55} style={{strokeWidth: 1.5}}/>
                    <div className="cardProfSummary">
                        <h1> 0 </h1>
                        <p> ressources disponibles</p>
                    </div>
                </div>
                <Link to="/comingsoon"> Voir mes ressources </Link>
                
            </div>
        </div>
        </>
    );
}

function ClassRecap ({ oneClass, profId, fetchMyClasses }) {
    const deactivateClassModal = useRef(null);
    const deleteClassModal = useRef(null);
    const studentModal = useRef(null);
    const [affectation, setAffectation] = useState({affectations: []})
    const [latestTest, setLatestTest] = useState(null)

    useEffect(() => {
        countExams(oneClass.group_id);
        getLatestTest();
    }, [oneClass])

    async function countExams(class_id){
        const result = await examsService.countExams(Number(class_id))
        setAffectation(result.data)
        return true;
    }

    async function getLatestTest(){
        const length = oneClass?.affectations?.length - 1
        const latestTestId = oneClass?.affectations.at(length).exam_id
        const result = await examsService.getTest(latestTestId)
        setLatestTest(result.data)
        console.log("latest test is: ", result.data.title)
        return true;
    }

    const openModal = (name) => {
        name.current?.showModal();
    }

    const closeModal = (name) => {
        name.current?.close();
    };

    async function deactivate(id){
        await groupService.update_group({[id] : {"is_active": "deactivate"}});
        fetchMyClasses(profId)
        return true;
    };

    async function deleteGroup(id){
        await groupService.delete_group(id);
        fetchMyClasses(profId)
        return true;
    }

    console.log("This class is: ", oneClass)

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
                <div className="dropdown">
                    <button className="class-card__menu"> <Ellipsis size={20} /> </button>
                    <div className="dropdown-content">
                        <a onClick={() => openModal(deactivateClassModal)}>Désactiver</a>
                        <a onClick={() => openModal(deleteClassModal)}>Supprimer</a>
                    </div>
                </div>
            </header>

            <dialog id="modal_deactivate" className={"modalNewStudents"} ref={deactivateClassModal}>
                <strong> Voulez vous vraiment désactiver la classe? </strong>
                <div>
                    <button onClick={() => deactivate(oneClass.group_id)} > Oui </button>
                    <button onClick={() => closeModal(deactivateClassModal)} > Non </button>
                </div>
            </dialog>

            <dialog id="modal_delete_group" className={"modalNewStudents"} ref={deleteClassModal}>
                <div><strong> Voulez vous vraiment supprimer la classe? </strong></div>
                <strong> Cette action est irréversible </strong>
                <div>
                    <button onClick={() => deleteGroup(oneClass.group_id)} > Oui </button>
                    <button onClick={() => closeModal(deleteClassModal)} > Non </button>
                </div>
            </dialog>

            <section className="class-card__stats">
                <div className="class-stat">
                <div className="class-stat__top">
                    <Trophy size={18} />
                    <span className="class-stat__value">--</span>
                </div>
                <span className="class-stat__label">Moyenne</span>
                </div>

                <div className="class-stat">
                <div className="class-stat__top">
                    <UsersRound size={18} />
                    <span className="class-stat__value">{oneClass.student?.length ?? "O"}</span>
                </div>
                <span className="class-stat__label">{oneClass.student?.length == 1 ? "Élève" : "Élèves"}</span>
                </div>

                <div className="class-stat">
                <div className="class-stat__top">
                    <FileText size={18} />
                    <span className="class-stat__value">{affectation?.affectations?.length}
                    </span>
                </div>
                <span className="class-stat__label">{affectation?.affectations?.length > 1 ? "Tests" : "Test"}</span>
                </div>
            </section>

            <section className="class-card__test">
                <div className="class-card__test-icon">
                <CalendarDays size={20} />
                </div>

                <div className="class-card__test-details">
                <p className="class-card__eyebrow">Dernier test</p>
                <h3 className="class-card__test-title">{latestTest?.title}</h3>
                <p className="class-card__date">{latestTest ? convertDate(latestTest.created_at) : "--" }</p>
                </div>

                <div className="class-card__score">
                <TrendingUp size={18} />
                <span>--/20</span>
                </div>
            </section>

            <footer className="class-card__actions">
                <button className="class-card__button button--secondary" onClick={() => openModal(studentModal)} >
                    <UsersRound size={18}/>
                    Voir les élèves
                </button>

                <dialog id="modal" className="modalNewStudents" ref={studentModal}>
                    <h2>Elèves de la classe {oneClass.name}</h2>
                    <table className="adminTable">
                        <thead>
                            <tr>
                                <th scope="col"> # </th>
                                <th scope="col"> Nom </th>
                                <th scope="col"> Prénom </th>
                            </tr>
                        </thead>
                        <tbody> 
                            {oneClass.student?.length == 0 ? (
                                <tr>
                                    <td colSpan={99}> Il n'y a pas d'élèves dans cette classe</td>
                                </tr>
                            ) : (
                                oneClass.student.map((student, i) => (
                                    <tr>
                                        <td> {i} </td>
                                        <td> {student.firstName}</td>
                                        <td> {student.lastName}</td>
                                    </tr>
                                    
                                ))
                            )}
                        </tbody>
                    </table>
                    <button onClick={() => closeModal(studentModal)}> &times; </button>
                </dialog>
                <button className="class-card__button button--primary" onClick={() => navigate(`myclass/${oneClass.group_id}`)}>
                <ArrowRight size={18} />
                Voir la classe
                </button>
            </footer>
        </div>

    </>)
}

function TestRecap ({ oneTest }) {
    const  navigate  = useNavigate();
    const [affectation, setAffectation] = useState({affectations: []})
    
    useEffect(() => {
        fetchAffectations(oneTest.exam_id);
    }, [oneTest])

    async function fetchAffectations(exam_id){
        const result = await examsService.getAffectations(Number(exam_id))
        setAffectation(result.data)
        return null;
    }

    const affectedGroups = {groups: (affectation.affectations ?? []).filter(
        (affect) => affect.group 
    )}

    const affectedStudents = {users: (affectation.affectations ?? []).filter(
        (affect) => affect.user 
    )} 

    const totalAffected = affectedStudents?.users?.length + (affectedGroups?.groups?.length)


    return (<>
        <div className="class-card">
            <header className="class-card__header">
                <div className="class-card__identity">
                    <div className="class-card__icon class-card__icon--coral" style={{
                            borderColor: oneTest.is_open ? "#a4f9a1" : "#232121",
                            backgroundColor: oneTest.is_open ? "#a4f9a1" : "#f9a1a18e",
                            color: oneTest.is_open ? "#269522" : "#972828",
                        }}>
                        <UsersRound size={22} />
                    </div>

                    <div>
                        <div className="class-card__title-row">
                        <h2 className="class-card__title">{oneTest.title}</h2>
                        </div>
                        <span className="class-card__status" style={{
                            borderColor: oneTest.is_open ? "#a4f9a1" : "#f9a1a1",
                            backgroundColor: oneTest.is_open ? "#a4f9a1" : "#f9a1a18e",
                            color: oneTest.is_open ? "#269522" : "#972828",
                        }}>{oneTest.is_open ? "Ouvert" : "Fermé"}</span>
                    </div>
                </div>

                <div className="class-stat">
                    <div className="class-stat__top">
                        <FileQuestionMark size={18} />
                        <span className="class-stat__value">{oneTest?.questions?.length}</span>
                    </div>
                    <span className="class-stat__label">Questions</span>
                </div>
            </header>

            <section className="class-card__test">
                <div className="class-card__test-details">
                    <TriangleRight size={40}/>
                </div>

                <div className="class-card__test-details">
                    <h3 className="class-card__test-title">Description</h3>
                    <p className="class-card__date">{oneTest.description}</p>
                </div>

            </section>

            <section className="class-card__stats">
                <div className="class-stat">
                    <div className="class-stat__top">
                        <Trophy size={18} />
                        <span className="class-stat__value">--</span>
                    </div>
                    <span className="class-stat__label">Moyenne</span>
                </div>

                <div className="class-stat">
                    <div className="class-stat__top">
                        <Gauge size={18} />
                        <span className="class-stat__value">{oneTest.level}</span>
                    </div>
                    <span className="class-stat__label">Niveau</span>
                </div>

                <div className="class-stat">
                    <div className="class-stat__top">
                        <UsersRound size={18} />
                        <span className="class-stat__value">{totalAffected}</span>
                    </div>
                    <span className="class-stat__label">{totalAffected == 1 ? "Assignation" : "Assignations" }</span>
                </div>
            </section>

            

            <footer className="class-card__actions">
                <button className="class-card__button button--secondary">
                <UsersRound size={18} />
                Voir les assignations
                </button>

                <button className="class-card__button button--primary" onClick={() => navigate(`mytests/${oneTest.exam_id}`)}>
                <ArrowRight size={18} />
                Voir le test
                </button>
            </footer>
        </div>

    </>)
}


const Professor = () => {
    const [me, setMe] = useState(null);
    const [myClasses, setMyClasses] = useState({groups: []});
    const [myTests, setMyTests] = useState({exams: []});
    const [myStudents, setMyStudents] = useState({users: []});
    const [affectation, setAffectation] = useState({affectations: []})

    const meID = me?.id;

    useEffect(() =>{
        fetchMyID();
    }, []);

    useEffect(() => {
        if (!meID) {return};
        fetchMyClasses(meID);
        fetchMyUsers(meID);
        fetchMyTests(meID);
    }, [meID]);




    async function fetchMyID(){
        try {
            const response = await authService.get_profile();
            setMe(response);
            document.cookie = `prof_id=${encodeURIComponent(response.id)}; Max-Age=${7 * 24 * 60 * 60}; Path=/; SameSite=Strict`;
            console.log("cookies are now: ", document.cookie)
            return response;
        } catch (err) {
            console.log("Error getting my ID: ", err);
        }
    }

    async function fetchMyClasses(id) {
        try {
            console.log("Fetching my classes...")
            const result = await groupService.getMyClassrooms(id);
            setMyClasses(result.data);
        } catch (err) {
            console.log("There was an error getting the classes: ", err);
        }
    }

    async function fetchMyTests(id) {
        try {
            console.log("Getting my tests ... ");
            const result = await examsService.getMyTests(id);
            console.log("he tests are: ", result.data)
            setMyTests(result.data);
        } catch (err) {
            console.log("Error getting my tests: ", err)
        }
    }

    async function fetchMyUsers(id){
        try {
            console.log("Fetching students of profID: ", id)
            const result = await authService.getMyStudents(id);
            console.log("My students are: ", result)
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
            <ProfHeader me={me} myClasses={myClasses} myStudents={myStudents} myTests={myTests}/>
            <h1> Classes actives</h1>
            <div className="RecapMyClasses">    
                {myClasses.groups.map((group, i) => (
                    group.is_active ? <ClassRecap oneClass={group} profId={meID} fetchMyClasses={fetchMyClasses}/> : null
                ))}
            </div>
            <h1> Tests récents</h1>
            <div className="RecapMyClasses">    
                {myTests.exams.map((exam, i) => (
                    <TestRecap oneTest={exam} />
                ))}
            </div>
            
        </section>
        </>
    )
}

export default Professor;