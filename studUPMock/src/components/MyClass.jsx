import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { groupService } from "../api/groups";
import { authService } from "../api/auth";


function ClassHeader({ group, students }){
    return(
        <>
        <div className="ClassroomHeader">
            <div className="StatBox">
                {console.log("student users", students.users)}
                <p> {students ? students.users.length : "-"} </p>
                <p> {students.users.length == 1 ? "élève" : "élèves"} </p>
            </div>
        </div>
        </>
    );
} 




function AddStudents({group, onAdd, close}){
    const {errRef} = useRef();
    const[count, setCount] = useState(0);
    const[loading, setLoading] = useState(false);
    const[success, setSuccess] = useState(false);
    const[errMsg, setErrMsg] = useState(null);

    const[addUsers, setAddUsers] = useState([]);


    useEffect(() => {
        setErrMsg(null);
    }, [count, addUsers])

    const handleAddRow = async (e) => {
        e.preventDefault();
        console.log(addUsers);
        console.log(addUsers.length);
        setCount(count+1);
        setAddUsers(prev =>([...prev, {
            "id": count,
            "firstName": null,
            "lastName": null,
            "username": "",
            "email": "s@email.com",
            "password": "",
            "role": "student",
            "classroom_id": group.group_id,
            "school": "",
            "professor_id": Number(group.professor_id),
            "authorized": true}]));
    }

    const handleEditRow = async(id, field, value) => {
        console.log("Editing user with id: ", id);
        console.log("value is: ", value);
        setAddUsers(prev => prev.map((user) => user.id === id ? {...user, [field]:value} : user))
    }

    function checkElements(ListofDict) {
        if (ListofDict[0] == null){
            setErrMsg("You have to add at least one new user.")
            console.error("You have to add at least one new user.")
            return false;
        }
        for (const element of ListofDict) {
            console.log("checking ", element)
            if (element.firstName === "" || element.lastName === "") {
                setErrMsg("Firstname or Lastname must contain at least one character")
                console.error("Firstname or Lastname must contain at least one character");
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
        console.log(addUsers)
        if (checkElements(addUsers)) {
            try {
                setLoading(true)
                const result = await authService.add_students(addUsers);
                console.log("Added: ", result);
                setAddUsers([]);
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
            <h1>Add students to the group {group.name}</h1>
        </div>
        
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
        {success ? <p> Successfully added </p> :(
            loading ? <p> En cours de chargement ... </p> : 
                <div className="table-container">
                    <table className="addStudents-modal-table">
                        <thead>
                            <tr>
                                <th scope="col"> # </th>
                                <th scope="col"> Nom </th>
                                <th scope="col"> Prénom </th>
                            </tr>
                        </thead>
                        <tbody>
                            {addUsers[0] == null ? (
                                <td colSpan={3}> No new user </td>
                            ) : (addUsers.map(user => (
                                <tr key={user?.id}>
                                    <td> {user?.id} </td>
                                    <td> <input value={user.lastname} onChange={(e) => handleEditRow(user.id, "lastName", e.target.value)}/></td> 
                                    <td> <input value={user.firstname} onChange={(e) => handleEditRow(user.id, "firstName", e.target.value)}/></td>
                                </tr>
                            )))}
                        </tbody>
                    </table>
                </div>
            )}
            <div>
                <button onClick={handleAddRow} > Add row </button>
                <button onClick={handleAddAll} > Save edits </button>
            </div>
            <div>
                <button onClick={handleClose} > X </button>
            </div>
        </>
    )
}






const MaClasse = () => {
    const { groupID } = useParams();
    const [students, setStudents] = useState({users: []});
    const [group, setGroup] = useState({groups: []});
    const [err, setErrMsg] = useState(null);
    const [editing, setEditing] = useState(false);

    const modalRef = useRef(null);
    
    useEffect(() => {
        fetchStudents(groupID);
        fetchGroup(groupID);
        console.log(modalRef)
    }, [editing]);

    const openModal = () => {
        modalRef.current?.showModal();
    };

    const closeModal = () => {
        console.log("Closing modal")
        modalRef.current?.close();
        console.log(modalRef.current?.close())
    };

    async function fetchStudents(ID) {
        try{
            console.log("Group from params is ", groupID)
            const response = await groupService.getClassroomStudents(ID);
            setStudents(response.data);
        } catch (err) {
            console.log("Error getting the students")
            console.log(err);
            setErrMsg(err);
        }
    }

    async function fetchGroup(ID) {
        try {
            console.log("Info founded for this group ID")
            const response = await groupService.getClassroomInfo(ID);
            console.log(response.data);
            setGroup(response.data);
        } catch (err) {
            console.log(err);
            setErr(err);
        }
    }

    
    return (<>
        <section className="adminSection" >

            
            <h1>
                Students of the class {group.name}
            </h1>

            <ClassHeader group={group} students={students}/>
            
            

            <table className="adminTable">
                <thead>
                    <tr>
                        <th scope="col">identifiant unique</th>
                        <th scope="col">First name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Username</th>
                        <th scope="col">email</th>
                    </tr>
                </thead>
                <tbody>
                    {students.users.at(0) == null ? (
                        <tr>
                            <td colSpan={8}>
                                No students for this classroom
                            </td>
                        </tr>
                    ) : ( 
                    students.users.map((user, i) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                            </tr>
                        )
                    ))}
                </tbody>
            </table>

        <button id="open" onClick={openModal}>Ajouter des élèves</button>

        <dialog id="modal"  className="modalNewStudents" ref={modalRef}>
            <AddStudents group={group} onAdd={() => fetchStudents(groupID)} close={closeModal}/>
        </dialog>

       
        </section>
    </>)
}

export default MaClasse;