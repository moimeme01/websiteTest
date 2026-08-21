import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { groupService } from "../api/groups";
import { authService } from "../api/auth";


function ClassHeader({ group, students }){
    return(
        <>
        <div className="ClassroomHeader">
            <div className="StatBox">
                {console.log(students.users)}
                <p> {students ? students.users.length : "-"} </p>
                <p> {students.users.length == 1 ? "élève" : "élèves"} </p>
            </div>
        </div>
        </>
    );
} 



const MaClasse = () => {
    const { groupID } = useParams();
    const [students, setStudents] = useState({users: []});
    const [group, setGroup] = useState({groups: []});
    const [err, setErr] = useState(null);
    
    useEffect(() => {
        fetchStudents(groupID);
        fetchGroup(groupID);
    }, []);

    async function fetchStudents(ID) {
        try{
            const response = await groupService.getClassroomStudents(ID);
            setStudents(response.data);
        } catch (err) {
            console.log("Error getting the students")
            console.log(err);
            setErr(err);
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
        <section>

            <ClassHeader group={group} students={students}/>
            <h1>
                Students of the class {group.name}
            </h1>
            <h4> Professor of this class is: {group.professor_id}</h4>
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

        </section>
    </>)
}

export default MaClasse;