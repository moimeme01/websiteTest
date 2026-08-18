import { useEffect,useState } from "react";
import axios from "../api/axios";
import { groupService } from "../api/groups";
import { useAuth } from "../context/AuthContext";


const AdminPage = () => {
    const [unAuthUsers, setUnAuthUsers] = useState({users: []});
    const [authUsers, setAuthUsers] = useState({users: []});
    const [groupList, setGroupsList] = useState({groups: []});
    const [selectedUsers, setSelectedUsers] = useState([]);
    const { unauthorized, authorization, authorized } = useAuth();
    const [error, setError] = useState(null);

    const [groupName, setGroupName] = useState("");
    const [groupAcademicYear, setAroupAcademicYear] = useState(0);
    const [groupProfessorId, setGroupProfessorId] = useState(0);
    const [groupActivity, setGroupActivity] = useState(false);
    
    async function fetchAuthUsers() {
        try{
            const requests = await authorized();
            console.log("here is the result of the request: ")
            console.log(requests)
            setAuthUsers(requests.data);
        
        } catch (err) {
            setError(err);
        }
    };

    async function fetchRequests() {
        try{
            const requests = await unauthorized();
            console.log("here are the unauth users: ")
            console.log(requests)
            setUnAuthUsers(requests.data);
            console.log(unAuthUsers)
            console.log(unAuthUsers.users)
            if (unAuthUsers.users.at(0) == null) {
                console.log('no unauth users');
            }
        } catch (err) {
            if (err) {
                setError(err);
            }
        }
    };
    
    async function fetchGroups() {
        try{
            console.log("fetching the groups!!!")
            const groups = await groupService.getGroupList();
            console.log("here are the groups, ", groups)
            setGroupsList(groups.data);

        } catch (err) {
            console.log("there was an error while checking the group list: ", err)
            if (err) {
                setError(err);
            }
        }
    };

    const handleAddGroup = async(e) => {
        e.preventDefault();
        try {
            console.log("function called !!!!")
            const response = await groupService.addNewGroup(
                {
                    professor_id: groupProfessorId,
                    name: groupName,
                    academic_year: groupAcademicYear,
                    is_active: groupActivity
                },
            );
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchRequests();
        fetchAuthUsers();
        fetchGroups();
    }, []);

    const handleAuthButton = async (e) => {
        e.preventDefault();
        try{
            const request = await authorization(selectedUsers);
            await fetchAuthUsers();
            await fetchRequests();
            setSelectedUsers([]);
        } catch (error) {
            setError(error)
        }


    }

    return (
        <>
        <section>
            <h1>
                Welcome to your admin page. 
            </h1>
            <p> Here are all the requests of accounts: </p>
            
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
            </div>


            <button
                onClick={(e) => handleAuthButton(e)}>
                Authorize selected users.
            </button>

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
                                <tr key={group.id}>
                                    <td>{i}</td>
                                    <td>{group.group_id}</td>
                                    <td>{group.professor_id}</td>
                                    <td>{group.name}</td>
                                    <td>{group.academic_year}</td>
                                    <td>{group.created_at}</td>
                                    <td>{group.is_active}</td>
                                </tr>
                            )
                        ))}
                    </tbody>
                </table>
            </div>

            <form onSubmit={handleAddGroup}>
                <h1>
                    Add a new group
                </h1>
                <fieldset>
                    <div className="form-type">
                        <label> Nom </label>
                        <input/>
                    </div>
                    <div className="form-type">
                        <label> Année académique </label>
                        <input/>
                    </div>
                    <div className="form-type">
                        <label> Professeur </label>
                        <select/>
                    </div>
                    <div className="form-type">
                        <label> Actif </label>
                        <input/>
                    </div>
                </fieldset>
                <button> Add the group </button>
            </form>

        </section>
        </>
    )
}

export default AdminPage;