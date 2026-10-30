import { useState, useEffect, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { groupService } from "../api/groups";
import { authService } from "../api/auth";

function get_cookie(name){
    let cookieName = name + "=";
    let cookieArray = document.cookie.split(";")

    for (const i in cookieArray) {
        const element = cookieArray[i];
        if (element.startsWith(cookieName, 0)){
            return element.split("=")[1]
        }
    }
}


function GroupForm( {professorId, fetchMyClasses, close}){
    const [groupName, setGroupName] = useState("");
    const [groupAcademicYear, setGroupAcademicYear] = useState(0);
    const [groupActivity, setGroupActivity] = useState(false);

    const handleAddGroup = async(e) => {
        e.preventDefault();
        try {
            await groupService.addNewGroup(
                {
                    professor_id: parseInt(professorId),
                    name: groupName,
                    academic_year: groupAcademicYear,
                    is_active: groupActivity
                },
            );
            fetchMyClasses(professorId)
        } catch (err) {
            console.log(err)
        }
    }
    
    
    return (
        <form className="register-form" onSubmit={handleAddGroup}>
            <h1>
                Nouvelle classe
            </h1>
            <fieldset className="form-section">
                <div className="form-field">
                    <label> Nom </label>
                    <input
                        type="text"
                        id="groupname"
                        required
                        onChange={(e) => setGroupName(e.target.value)}
                        value={groupName}
                    />
                </div>
                <div className="form-field">
                    <label> Année académique </label>
                    <input
                        type="number"
                        id="academic_year"
                        defaultValue={2026}
                        required
                        onChange={(e) => setGroupAcademicYear(Number(e.target.value))}
                    />
                </div>
                
                <div className="form-field">
                    <label> Actif </label>
                    <input
                        id="isActive"
                        name="isActive"
                        type="checkbox"
                        checked={groupActivity}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setGroupActivity(true);
                            } else {
                                setGroupActivity(false);
                            }}}
                    />
                </div>
            </fieldset>
            <button typ="submit"> Créer </button>
            <button type="button" onClick={close}> Fermer </button>
        </form>
    );
}


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

const MesClasses = () => {
    let prof_id = get_cookie("prof_id");
    const [ myClasses, setMyClasses ] = useState({groups: []});
    const [error, setError] = useState(null);
    
    const {errRef} = useRef();
    const modalRef = useRef();


    const navigate = useNavigate();

    useEffect(() => {
        fetchMyClasses(prof_id)
    }, [prof_id]);

    async function fetchMyClasses(id){
        try {
            console.log("Getting my classes in myclasses")
            const response = await groupService.getMyClassrooms(id);
            setMyClasses(response.data);
        } catch (err) {
            console.log("Erron in getting me, my classes: ", err)
            setError(err.response?.data?.message);
        }
    }

    const openModal = () => {
        modalRef.current?.showModal();
    }

    const closeModal = () => {
        modalRef.current?.close();
    };

    
    return (
        <>
            <div className="table-container">
                <table className="adminTable">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nom</th>
                            <th scope="col">Année académique</th>
                            <th scope="col">créée le</th>
                            <th scope="col">Élèves</th>
                            <th scope="col">active?</th>
                            <th scope="col">Tests</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myClasses.groups.at(0) == null ? (
                            <tr>
                                <td colSpan={7}>
                                    Vous n'avez pas de classes
                                </td>
                            </tr>
                        ) : ( 
                        myClasses.groups.map((group, i) => (
                                <tr key={i} style={{backgroundColor: group.is_active ? "#a4f9a1" : "#f9a1a1"}} onClick={() => navigate(`/professor/myclass/${group.group_id}`)}>
                                    <td>{i}</td>
                                    <td>{group.name}</td>
                                    <td>{group.academic_year}</td>
                                    <td>{convertDate(group.created_at)}</td>
                                    <td>{group?.student?.length}</td>
                                    <td>{group.is_active ? "Oui" : "Non"}</td>
                                    <td>{group?.affectations?.length}</td>
                                </tr>
                            )
                        ))}
                    </tbody>
                </table>
            </div>
            <button onClick={openModal}> Nouvelle classe </button>
            <dialog id="modal" className="modalNewStudents" ref={modalRef}>
                <p ref={errRef} className={error ? "errmsg" : "offscreen"} aria-live="assertive"> {error} </p>
                <GroupForm professorId={prof_id} fetchMyClasses={fetchMyClasses} close={closeModal}/>
            </dialog>
        </>
    );

}



export default MesClasses;