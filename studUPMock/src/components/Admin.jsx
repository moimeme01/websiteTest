import { useEffect,useState } from "react";
import axios from "../api/axios";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authService } from "../api/auth";
import { groupService } from "../api/groups";
import { useAuth } from "../context/AuthContext";
const FIRSTNAME_REGEX = /^[A-Z][a-z]{2,19}$/;
const LASTNAME_REGEX = /^[A-Z][a-z]{2,19}$/;

function RequestTables ({unAuthUsers, selectedUsers, setSelectedUsers}){
    return (
        <>
        <table className="adminTable">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">First name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Username</th>
                    <th scope="col">email</th>
                    <th scope="col">Role</th>
                    <th scope="col">Classroom</th>
                    <th scope="col">School</th>
                    <th scope="col">Professor</th>
                    <th scope="col">Authorize</th>
                </tr>
            </thead>
            <tbody>
                {unAuthUsers.users.at(0) == null ? (
                    <tr>
                        <td colSpan={8}>
                            No unauthorized users
                        </td>
                    </tr>
                ) : ( 
                unAuthUsers.users.map((user, i) => (
                        <tr key={user.id}>
                            <td>{i}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.classroom}</td>
                            <td>{user.school}</td>
                            <td>{user.professor}</td>
                            <td> 
                                <input 
                                    type="checkbox" 
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedUsers([...selectedUsers, user.id]);
                                        } else {
                                            setSelectedUsers(
                                                selectedUsers.filter((id) => id !== e.target.value)
                                            );
                                        }
                                    }}
                                    value={user.id}
                                />
                            </td>
                        </tr>
                    )
                ))}
            </tbody>
        </table>
    </>
    );
}












const AdminPage = () => {
    const [unAuthUsers, setUnAuthUsers] = useState({users: []});
    const [authUsers, setAuthUsers] = useState({users: []});
    const [groupList, setGroupsList] = useState({groups: []});
    const [profList, setProfList] = useState({profs: []});
    const [selectedUsers, setSelectedUsers] = useState([]);
    const { unauthorized, authorization, authorized } = useAuth();
    const [error, setError] = useState(null);


    const [groupName, setGroupName] = useState("");
    const [groupAcademicYear, setGroupAcademicYear] = useState(0);
    const [groupProfessorId, setGroupProfessorId] = useState(0);
    const [groupActivity, setGroupActivity] = useState(false);


    useEffect(() => {
        fetchRequests();
        fetchAuthUsers();
        fetchGroups();
        fetchProfessors();
    }, []);

    useEffect(() => {
        setGroupAcademicYear(groupAcademicYear);
        setGroupName(groupName);
        setGroupProfessorId(groupProfessorId);
        setGroupActivity(groupActivity);
    }, [groupAcademicYear, groupActivity, groupName, groupProfessorId])
    
    async function fetchAuthUsers() {
        try{
            console.log("Looking for authorized users")
            const requests = await authorized();
            setAuthUsers(requests.data);
        } catch (err) {
            setError(err);
        }
    };

    async function fetchRequests() {
        try{
            console.log("Looking for authorized users")
            const requests = await unauthorized();
            setUnAuthUsers(requests.data);
        } catch (err) {
            if (err) {
                setError(err);
            }
        }
    };
    
    async function fetchGroups() {
        try{
            console.log("fetching the groups")
            const groups = await groupService.getGroupList();
            setGroupsList(groups.data);
        } catch (err) {
            console.log("there was an error while checking the group list: ", err)
            if (err) {
                setError(err);
            }
        }
    };

    async function fetchProfessors(){
        try {
            console.log("Fetching professor list");
            const result = await authService.get_prof_list();
            setProfList(result);
            console.log("Here are the professors: ", result.data);
        } catch (err) {

            setError(err);
        }
    };

    const handleAddGroup = async(e) => {
        e.preventDefault();
        try {
            console.log("function called !!!!")
            console.log("adding the group: ", {
                    professor_id: groupProfessorId,
                    name: groupName,
                    academic_year: groupAcademicYear,
                    is_active: groupActivity
                })
            const response = await groupService.addNewGroup(
                {
                    professor_id: parseInt(groupProfessorId),
                    name: groupName,
                    academic_year: groupAcademicYear,
                    is_active: groupActivity
                },
            );

            setGroupAcademicYear(0)
            setGroupName("")
            setGroupProfessorId(0)
            setGroupActivity(false)
            await fetchGroups();
            await fetchProfessors();
        } catch (err) {
            console.log(err)
        }
    }

    const handleAuthorizeButton = async (e) => {
        e.preventDefault();
        try{
            const request = await authorization(selectedUsers);
            await fetchAuthUsers();
            await fetchRequests();
            setSelectedUsers([]);
        } catch (error) {
            setError(error);
        }


    }

    return (
        <>
        <section className="adminSection">
            <div>
                <div className="table-container">
                    <h1> Account requests </h1>
                    <RequestTables unAuthUsers={unAuthUsers} selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers}/>
                </div>


                <button
                    onClick={(e) => handleAuthorizeButton(e)}>
                    Authorize selected users.
                </button>
            </div>
            
            <div>
                <div className="table-container">
                    <table className="adminTable">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">First name</th>
                                <th scope="col">Last Name</th>
                                <th scope="col">Username</th>
                                <th scope="col">email</th>
                                <th scope="col">Role</th>
                                <th scope="col">Classroom</th>
                                <th scope="col">School</th>
                                <th scope="col">Professor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {authUsers.users === null ? (
                                <tr>
                                    <td colSpan={8}>
                                        No authorized users
                                    </td>
                                </tr>
                            ) : ( 
                            authUsers.users.map((user, i) => (
                                    <tr key={user.id}>
                                        <td>{i}</td>
                                        <td>{user.firstName}</td>
                                        <td>{user.lastName}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>{user.classroom}</td>
                                        <td>{user.school}</td>
                                        <td>{user.professor}</td>
                                    </tr>
                                )
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div>
                <h1> Here are all the groups: </h1>
                <div className="table-container">
                    <table className="adminTable">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">group id</th>
                                <th scope="col">professor id</th>
                                <th scope="col">name</th>
                                <th scope="col">academic year</th>
                                <th scope="col">created at</th>
                                <th scope="col">is active</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupList.groups.at(0) == null ? (
                                <tr>
                                    <td colSpan={7}>
                                        No group available
                                    </td>
                                </tr>
                            ) : ( 
                            groupList.groups.map((group, i) => (
                                    <tr key={group.id} style={{backgroundColor: group.is_active ? "#a4f9a1" : "#f9a1a1"}}>
                                        <td>{i}</td>
                                        <td>{group.group_id}</td>
                                        <td>{group.professor_id}</td>
                                        <td>{group.name}</td>
                                        <td>{group.academic_year}</td>
                                        <td>{group.created_at}</td>
                                        <td>{String(group.is_active)}</td>
                                    </tr>
                                )
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
                <form onSubmit={handleAddGroup}>
                    <h1>
                        Add a new group
                    </h1>
                    <fieldset>
                        <div className="form-type">
                            <label> Nom </label>
                            <input
                                type="text"
                                id="groupname"
                                required
                                onChange={(e) => setGroupName(e.target.value)}
                                value={groupName}
                            />
                        </div>
                        <div className="form-type">
                            <label> Année académique </label>
                            <input
                                type="number"
                                id="academic_year"
                                defaultValue={2026}
                                required
                                onChange={(e) => setGroupAcademicYear(e.target.value)}
                            />
                        </div>
                        <div className="form-type">
                            <label> Professeur </label>
                            <select name="profname" value={String(groupProfessorId)} onChange={(e) => setGroupProfessorId(e.target.value)}>
                                <option value=""> -- Select the prof name --</option>
                                { profList.data && profList.data.users.length > 0 ? (profList.data.users.map(
                                    e => <option key={e.id} value={String(e.id)}> {e.lastName}</option>
                                )): (<option value="noprof"> There is no professor available</option>) 
                                }
                            </select>
                        </div>
                        <div className="form-type">
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
                    <button> Add the group </button>
                </form>
            </div>

        </section>
        </>
    )
}

export default AdminPage;