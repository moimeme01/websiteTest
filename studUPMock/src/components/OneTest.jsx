import { useEffect, useState, useRef} from "react";
import { useParams } from "react-router-dom";
import { examsService } from "../api/exams";
import { authService } from "../api/auth";
import { groupService } from "../api/groups";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import { faL } from "@fortawesome/free-solid-svg-icons";


function ExamRecap( {affectation, exam} ) {
    const affectedGroups = {groups: (affectation.affectations ?? []).filter(
        (affect) => affect.group 
    )}

    const affectedStudents = {users: (affectation.affectations ?? []).filter(
        (affect) => affect.user 
    )}
    

    return (
        <>
            <section className="oneTest_header">
                <div>
                    <h2>{exam.title}</h2> - <h3>{exam.chapter}</h3>
                    Description: {exam.description}
                </div>
                <div>
                    <h2>paramètres</h2>
                </div>
                <div>
                    <h2>Disponibilités:</h2>{affectedGroups.groups.length} classes - {affectedStudents.users.length} étudiants
                </div>
            </section>
        </>
    );
}

function AddAssignation({fetchAffectations, assignToGroups, assignToUsers, exam}){
    const [assignGroup, setAssignGroup] = useState(null);
    const [assignStudents, setAssignStudents] = useState(null);
    const [isLoading, setLoading] = useState(false);


    const handleSubmitStudents = async (e) => {
        try {
            console.log("Adding affectation")
            setLoading(true)
            console.log("Affect groups: ", Number(assignGroup))
            console.log("affect students: ", assignStudents)
            await examsService.newAffectation({
                exam_id: exam.exam_id,
                group: Number(assignGroup)===0 ? null : [Number(assignGroup)],
                user: Number(assignStudents)===0 ? null : [Number(assignStudents)]
            })
            setLoading(false)
            setAssignGroup(null)
            setAssignStudents(null)
            fetchAffectations(exam.exam_id)
            return null
        } catch (err) {
            console.error(err)
        }
    }

    return (<>
        <section className="adminSection">
            <h2> Assigner </h2>
            { isLoading ? (
                <>
                <h1> Chargement ... </h1>
                </>
                
            ): (
                <form className="register-form" onSubmit={handleSubmitStudents}>
                    <fieldset className="form-section">
                        <div className="form-field">
                            <label> Classes </label>
                            <select onChange={(e) => setAssignGroup(e.target.value)} disabled={assignToGroups.groups.length === 0}>
                                <option value="" disabled={assignToGroups.groups.length > 0}> {assignToGroups.groups.length > 0 ? "-- séléctionnez une classe --" : "Vous n'avez pas de classe"} </option>
                                {assignToGroups.groups.map((group) => (
                                    <option value={group?.group_id} key={group?.group_id}> {group?.name} </option>
                                ))}
                            </select>
                        </div>   
                        
                        <div className="form-field">
                            <label> Étudiants </label>
                            <select onChange={(e) => setAssignStudents(e.target.value)} disabled={assignToUsers.users.length === 0}>
                                <option value="" disabled={assignToUsers.users.length > 0}> {assignToUsers.users.length > 0 ? "-- séléctionnez un(e) étudiant(e) --" : "Vous n'avez pas d'étudiants"}</option>
                                {assignToUsers.users.map((user) => (
                                    <option value={user?.id} key={user?.id}> {user?.lastName} </option>
                                ))}
                            </select>
                        </div>
                    </fieldset>
                    
                    <button className="form-button"> Appliquer </button>
                </form>
            )}
            
        </section>
    </>)
}


function AddQuestion({exam, onAdd, close}){
    const {errRef} = useRef();
    const[count, setCount] = useState(0);
    const[loading, setLoading] = useState(false);
    const[success, setSuccess] = useState(false);
    const[errMsg, setErrMsg] = useState(null);

    const[addQuestions, setAddQuestions] = useState([]);


    useEffect(() => {
        setErrMsg(null);
    }, [count, addQuestions])

    const handleAddRow = async (e) => {
        e.preventDefault();
        setCount(count+1);
        setAddQuestions(prev =>([...prev, {
            "question_id": count,
            "exam_id": Number(exam.exam_id),
            "question_text":"",
            "difficulty": ""}]));
    }

    const handleEditRow = async(id, field, value) => {
        setAddQuestions(prev => prev.map((question) => question.question_id === id ? {...question, [field]:value} : question))
    }

    function checkElements(ListofDict) {
        if (ListofDict[0] == null){
            setErrMsg("Vous devez ajouter au moins une question.")
            console.error("You have to add at least one new question.")
            return false;
        }
        for (const element of ListofDict) {
            console.log("checking ", element)
            if (element.question_text === "") {
                setErrMsg("Les questions doivent contenir au moins un caractère")
                console.error("Question must contain at least one character");
                return false;
            } 
        }
        return true;
    }

    const handleClose = () => {
        setSuccess(false);
        close();
    }
    const handleAddAll = async(e) => {
        if (checkElements(addQuestions)) {
            try {
                setLoading(true)
                const result = await examsService.addquestion(addQuestions);
                setAddQuestions([]);
                setCount(0);
                setLoading(false)
                setSuccess(true)
            } catch (err) {
                console.error("Status:", err.response?.status);
                console.error("FastAPI response:", err.response?.data);
                console.error("Detail:", err.response?.data?.detail);
                setErrMsg(err.response?.data?.detail?.message)
            } finally {
                if (onAdd) onAdd();
            }
        }
        
    }

    return (
        <>
        <div>
            <h1>Ajouter des questions {exam.title}</h1>
        </div>
        
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
        {success ? <p> Questions ajoutées </p> :(
            loading ? <p> En cours de chargement ... </p> : 
                <div className="table-container">
                    <table className="addStudents-modal-table">
                        <thead>
                            <tr>
                                <th scope="col"> # </th>
                                <th scope="col"> texte </th>
                                <th scope="col"> difficulté </th>
                            </tr>
                        </thead>
                        <tbody>
                            {addQuestions[0] == null ? (
                                <tr>
                                    <td colSpan={99}> Aucune nouvelle question </td>
                                </tr>
                            ) : (addQuestions.map(question => (
                                <tr key={question?.question_id}>
                                    <td> {question?.question_id} </td>
                                    <td> <input value={question.question_text} onChange={(e) => handleEditRow(question.question_id, "question_text", e.target.value)}/></td> 
                                    <td> <input value={question.difficulty} onChange={(e) => handleEditRow(question.question_id, "difficulty", Number(e.target.value))}/></td> 
                                </tr>
                            )))}
                        </tbody>
                    </table>
                </div>
            )}
            <div>
                <button onClick={handleAddRow} > Nouvelle ligne </button>
                <button onClick={handleAddAll} > Sauvegarder </button>
            </div>
            <div>
                <button onClick={handleClose} > X </button>
            </div>
        </>
    )
}

function QuestionsTable({fetchQuestions, questionList}) {
    const [edit, setEdit] = useState(null);
    const [editQuestionID, setEditQuestionID] = useState(null)
    const [updateQuestions, setUpdateQuestions] = useState({questions: []})

    function handleEditRow(id){
        setEditQuestionID((currentID) => currentID === id ? null : id);
        return true;
    }

    const handleSaveEdits = async (e) => {
        e.preventDefault();
        if (updateQuestions.questions.length == 0 ) {
            console.log("No edited questions.")
        } else {
            const response = await examsService.editQuestion(updateQuestions);
            console.log("response from server: ", response.message);
        }
        setEditQuestionID;
        setUpdateQuestions({questions: []});
        await fetchQuestions(questionList?.questions.at(0).exam_id);
        return true;
    }



    const handleDeleteID = async(e, id) => {
        try {
            console.log("Trying to cancel the question ...")
            await examsService.deleteQuestion(Number(id));
            fetchQuestions(questionList?.questions.at(0).exam_id);
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <table className="adminTable">
                <thead>
                    <tr>
                        <th scope="col"> # </th>
                        <th scope="col"> texte </th>
                        <th scope="col"> notes </th>
                        <th scope="col"> difficulté </th>
                        <th/>
                    </tr>
                </thead>
                <tbody>
                    {questionList.questions.at(0) == null ? (
                        <tr>
                            <td colSpan={99}>
                                Aucune question pour ce test
                            </td>
                        </tr>
                    ) : ( 
                    questionList.questions.map((question, i) => (
                            <tr key={question.question_id}>
                                <td>{i}</td>
                                <td>{question.question_text}</td>
                                <td>{question.notes ? question.notes : "-"}</td>
                                <td>{question.difficulty ? question.difficulty : "Not defined"}</td>
                                <td className="action">
                                    <div className="action_cell">
                                        <div className={`actionIcons ${edit === question.question_id ? "open" : ""}`}>
                                            <a key={question.question_id+1} className="action_btn" onClick={() => handleEditRow(question.question_id)}> <Pencil size={25} strokeWidth={1.5}/> </a>
                                            <a key={question.question_id+2} className="action_btn" onClick={(e) => {
                                                const confirmBox = window.confirm("Do you really want to delete the question?") 
                                                if (confirmBox === true ){
                                                    handleDeleteID(e, question.question_id)
                                                } else {console.log("Abort delete")}}}> <Trash size={25} strokeWidth={1.5} /> </a>
                                        </div>
                                        <span key={question.question_id+3} className="ellipsis" onClick={() => setEdit(prev => (prev === question.question_id ? null : question.question_id))}> <EllipsisVertical size={25} strokeWidth={1.5} /> </span>
                                    </div>
                                </td>
                            </tr>
                        )
                    ))}
                </tbody>
            </table>
            <button onClick={(e) => handleSaveEdits(e, "groups")} hidden={editQuestionID==null}> Sauvegarder </button>

        </>
    )
}




const OneTest = () => {
    const testID = useParams();
    const [exam, setExam] = useState({exam: []});
    const [questions, setQuestions] = useState({questions: []})
    const [affectation, setAffectation] = useState({affectations: []})
    const [myClasses, setMyClasses] = useState({groups: []});
    const [myStudents, setMyStudents] = useState({users: []});

    const modalRef = useRef(null);

    useEffect(() => {
        fetchTest(testID.testID);
        fetchQuestions(testID.testID);
        fetchAffectations(testID.testID);
    }, [testID])

    useEffect(() => {
        fetchMyClasses(exam.professor_id);
        fetchMyUsers(exam.professor_id);
    }, [exam, affectation])




    async function fetchTest(testID) {
        try {
            const result = await examsService.getTest(testID);
            setExam(result.data);
        } catch (err) {
            console.log("Error getting my tests: ", err)
        }
    }

    async function fetchQuestions(testID) {
        try {
            const result = await examsService.getQuestions(testID)
            setQuestions(result.data)
        } catch (err) {
            console.error("Status:", err.response?.status);
            console.error("FastAPI response:", err.response?.data);
            console.error("Detail:", err.response?.data?.detail);
            return err
        }
    }

    async function fetchAffectations(exam_id){
        const result = await examsService.getAffectations(Number(exam_id))
        setAffectation(result.data)
        return null;
    }

    async function fetchMyClasses(id){
        try {
            const response = await groupService.getMyClassrooms(id);
            setMyClasses(response.data);
        } catch (err) {
            console.log("Error in getting me, my classes: ", err)
        }
    }
    async function fetchMyUsers(id){
        try {
            const result = await authService.getMyStudents(id);
            setMyStudents(result)
        } catch (err) {
            console.log("There was an error getting my students: ", err)
        }
    }

    const openModal = () => {
        modalRef.current?.showModal();
    }

    const closeModal = () => {
        modalRef.current?.close();
    };

    const filteredStudents = {
        users : (myStudents.users ?? []).filter(
            (student) => !(affectation.affectations ?? []).some(
                (affected) => affected.user === student.id
            )
        )
    }

    const filteredGroups = {
        groups : (myClasses.groups ?? []).filter(
            (group) => !(affectation.affectations ?? []).some(
                (affected) => affected.group === group.group_id
            )
        )
    }

    return(
        <>
            <ExamRecap affectation={affectation} exam={exam}/>
            <AddAssignation fetchAffectations={fetchAffectations} assignToUsers={filteredStudents} assignToGroups={filteredGroups} exam={exam}/>
            <section className="adminSection">
                <h2> Questions </h2>
                <QuestionsTable fetchQuestions={fetchQuestions} questionList={questions}/>
                <button className="class-card__button" onClick={openModal}> Ajouter des questions</button>
                <dialog id="modal" className="modalNewStudents" ref={modalRef}>
                    <AddQuestion exam={exam} onAdd={() => fetchQuestions(exam.exam_id)} close={closeModal} />
                </dialog>
            </section>
            <section className="adminSection">
                <h2> Soumissions </h2>
            </section>
        </>
    )
}

export default OneTest;