import { useEffect, useState, useRef } from "react";
import axios from "../api/axios";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authService } from "../api/auth";
import { groupService } from "../api/groups";
import { useAuth } from "../context/AuthContext";
import { ArrowDownNarrowWide, EllipsisVertical, Pencil, Trash} from "lucide-react";


const FIRSTNAME_REGEX = /^[A-Z][a-z]{2,19}$/;
const LASTNAME_REGEX = /^[A-Z][a-z]{2,19}$/;


function sortRule (list, key, column) {
    list?.[key].sort((a,b) => {
        const colA = a[column];
        const colB = b[column];
        if (typeof(colA) === "boolean" && typeof(colB) === "boolean") { 
            return Number(colB) - Number(colA)
        }
        if (typeof(colA) === "string" && typeof(colB) === "string") { 
            return colA.localeCompare(colB) 
        }
        else if (colA > colB) {
            return 1
        }
        else if (colA < colB) {
            return -1
        }
        else {return 0}
    });
    
    return list;
    
}

function RequestTables ({unAuthUsers, selectedUsers, setSelectedUsers}){

    const [sortColumn, setSortColumn] = useState();
    const [logo, setLogo] = useState(null);

    useEffect(() => {
        sortRule(unAuthUsers, "users", sortColumn);
    }, [sortColumn])

    const onHeaderClick = (column) => ({
        onClick: () => {
            console.log(`clicked on ${column}`)
            sortRule(unAuthUsers, "users", column)
            setSortColumn(column)
            // do something
            },
        });  

    return (
        <>
        <table className="adminTable">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col" {...onHeaderClick("firstName")}> firstName {sortColumn == "firstName" ? <ArrowDownNarrowWide className="sortLogo" size={11}/> : null} </th>
                    <th scope="col" {...onHeaderClick("lastName")}> lastName {sortColumn == "lastName" ? <ArrowDownNarrowWide className="sortLogo" size={11}/> : null} </th>
                    <th scope="col" {...onHeaderClick("username")}> username {sortColumn == "username" ? <ArrowDownNarrowWide className="sortLogo" size={11}/> : null} </th>
                    <th scope="col" {...onHeaderClick("email")}> email {sortColumn == "email" ? <ArrowDownNarrowWide className="sortLogo" size={11}/> : null} </th>
                    <th scope="col" {...onHeaderClick("role")}> role {sortColumn == "role" ? <ArrowDownNarrowWide className="sortLogo" size={11}/> : null} </th>
                    <th scope="col" {...onHeaderClick("classroom")}> classroom {sortColumn == "classroom" ? <ArrowDownNarrowWide className="sortLogo" size={11}/> : null} </th>
                    <th scope="col" {...onHeaderClick("school")}> school {sortColumn == "school" ? <ArrowDownNarrowWide className="sortLogo" size={11}/> : null} </th>
                    <th scope="col" {...onHeaderClick("professor")}> professor {sortColumn == "professor" ? <ArrowDownNarrowWide className="sortLogo" size={11}/> : null} </th>
                    <th scope="col" >Authorize</th>
                    <th scope="col"> </th>
                </tr>
            </thead>
            <tbody>
                {unAuthUsers.users.at(0) == null ? (
                    <tr>
                        <td colSpan={100}>
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
                            <td key={user.id} onClick={() => handleEditRow(user.id)}>
                                <EllipsisVertical size={16}/>
                            </td>
                            
                        </tr>
                    )
                ))}
            </tbody>
        </table>
    </>
    );
}


  


function AuthorizedTable ({authUsers, editUserId, handleDeleteUser, handleEditUserRow, editedUser, setEditedUser, groupList, profList}) {
    const [sortColumn, setSortColumn] = useState();
    const [edit, setEdit] = useState(null);

    useEffect(() => {
        sortRule(authUsers, "users", sortColumn);
    }, [sortColumn])

    const onHeaderClick = (column) => ({
        onClick: () => {
            console.log(`clicked on ${column}`)
            sortRule(authUsers, "users", column)
            setSortColumn(column)
            // do something
            },
        });   
    

    return(
        <>
            <table className="adminTable">
                <thead>
                    <tr>
                        <th scope="col" > # </th>
                        <th scope="col" {...onHeaderClick("firstName")}> firstName {sortColumn == "firstName" ? <ArrowDownNarrowWide className="sortLogo" size={11}/> : null} </th>
                        <th scope="col" {...onHeaderClick("lastName")}> lastName {sortColumn == "lastName" ? <ArrowDownNarrowWide className="sortLogo" size={11}/> : null} </th>
                        <th scope="col" {...onHeaderClick("username")}> username {sortColumn == "username" ? <ArrowDownNarrowWide className="sortLogo" size={11}/> : null} </th>
                        <th scope="col" {...onHeaderClick("email")}> email {sortColumn == "email" ? <ArrowDownNarrowWide className="sortLogo" size={11}/> : null} </th>
                        <th scope="col" {...onHeaderClick("role")}> role {sortColumn == "role" ? <ArrowDownNarrowWide className="sortLogo" size={11}/> : null} </th>
                        <th scope="col" {...onHeaderClick("classroom")}> classroom {sortColumn == "classroom" ? <ArrowDownNarrowWide className="sortLogo" size={11}/> : null} </th>
                        <th scope="col" {...onHeaderClick("school")}> school {sortColumn == "school" ? <ArrowDownNarrowWide className="sortLogo" size={11}/> : null} </th>
                        <th scope="col" {...onHeaderClick("professor")}> professor {sortColumn == "professor" ? <ArrowDownNarrowWide className="sortLogo" size={11}/> : null} </th>
                        <th scope="col"> </th>

                    </tr>
                </thead>
                <tbody >
                    {authUsers.users === null ? (
                        <tr>
                            <td colSpan={100}>
                                No authorized users
                            </td>
                        </tr>
                    ) : ( 
                    authUsers.users.map((user, i) => (
                            <tr key={user.id}>
                                <td>{i}</td>
                                <td>{ editUserId === user.id ? <input value={editedUser[user.id]?.firstName ?? user.firstName} onChange={
                                    (e) => setEditedUser( old => ({
                                        ...old, [user.id]:{ ...old[user.id], firstName: e.target.value}
                                    }))}/> : user.firstName}
                                </td>
                                <td>{editUserId == user.id ? <input value={editedUser[user.id]?.lastName ?? user.lastName} onChange={
                                    (e) => setEditedUser( old => ({
                                        ...old, [user.id]:{ ...old[user.id], lastName: e.target.value}
                                    }))}/> : user.lastName}
                                </td>
                                <td>{editUserId == user.id ? <input value={editedUser[user.id]?.username ?? user.username} onChange={
                                    (e) => setEditedUser( old => ({
                                        ...old, [user.id]:{ ...old[user.id], username: e.target.value}
                                    }))}/> : user.username}
                                </td>
                                <td>{editUserId == user.id ? <input value={editedUser[user.id]?.email ?? user.email} onChange={
                                    (e) => setEditedUser( old => ({
                                        ...old, [user.id]:{ ...old[user.id], email: e.target.value}
                                    }))}/> : user.email}
                                </td>
                                <td>{editUserId == user.id ? <input value={editedUser[user.id]?.role ?? user.role} onChange={
                                    (e) => setEditedUser( old => ({
                                        ...old, [user.id]:{ ...old[user.id], role: e.target.value}
                                    }))}/> : user.role}
                                </td>
                                <td>{editUserId == user.id ? <select value={editedUser[user.id]?.classroom_id ?? user.classroom_id} onChange={
                                    (e) => setEditedUser( old => ({
                                        ...old, [user.id]:{ ...old[user.id], classroom_id: e.target.value}
                                    }))}>
                                        <option value=""> -- Select a group -- </option>
                                        { groupList && groupList.groups.length > 0 ? (groupList.groups.map(
                                            e => <option key={e.group_id} value={String(e.group_id)}> {e.name}</option>
                                        )): (<option value="noprof"> There is no group available</option>) 
                                        }
                                    </select>
                                    : (user.role == "professor" ? groupList.groups.filter(e => e.professor_id === user.id).length : groupList.groups?.find(u => u.group_id === user.classroom_id)?.name)}
                                </td>
                                <td>{editUserId == user.id ? <select value={editedUser[user.id]?.school ?? user.school} onChange={
                                    (e) => setEditedUser( old => ({
                                        ...old, [user.id]:{ ...old[user.id], school: e.target.value}
                                    }))}>
                                    <option value=""> -- Select the school --</option>
                                        
                                    </select>
                                    : user.school}
                                </td>
                                <td>{editUserId == user.id ? <select value={editedUser[user.id]?.professor ?? user.professor} onChange={
                                    (e) => setEditedUser( old => ({
                                        ...old, [user.id]:{ ...old[user.id], professor: e.target.value}
                                    }))}>
                                        { profList && profList.users.length > 0 ? (profList.users.map(
                                            e => <option key={e.id} value={String(e.id)}> {e.lastName}</option>
                                        )): (<option value="noprof"> There is no professor available</option>) 
                                        }
                                    </select>
                                    : user.professor}
                                </td>
                                <td className="action">
                                    <div className="action_cell">
                                        <div className={`actionIcons ${edit === user.id ? "open" : ""}`}>
                                            <a key={user.id+1} className="action_btn" onClick={() => handleEditUserRow(user.id)}> <Pencil size={25} strokeWidth={1.5}/> </a>
                                            <a key={user.id+2} className="action_btn" onClick={() => handleDeleteUser(user.id)}> <Trash size={25} strokeWidth={1.5} /> </a>
                                        </div>
                                        <span key={user.id+3} className="ellipsis" onClick={() => setEdit(prev => (prev === user.id ? null : user.id))}> <EllipsisVertical size={25} strokeWidth={1.5} /> </span>
                                    </div>
                                </td>
                            </tr>
                        ) 
                    ))}
                </tbody>
            </table>
    </>
    );
}





function TableGroups({groupList, editGroupId, handleEditGroupRow, editedGroup, setEditGroupID, setEditedGroup, profList}) {

    const [sortColumn, setSortColumn] = useState();
    const [edit, setEdit] = useState(null);


    useEffect(() => {
        sortRule(groupList, "groups", sortColumn);
    }, [sortColumn])

    const onHeaderClick = (column) => ({
        onClick: () => {
            console.log(`clicked on ${column}`)
            sortRule(groupList, "groups", column)
            setSortColumn(column)
            // do something
            },
        });    

    return(
        <table className="adminTable">
            <thead>
                <tr>
                    <th scope="col"> # </th>
                    <th scope="col" {...onHeaderClick("group_id")}>group id {sortColumn == "group_id" ? <ArrowDownNarrowWide size={11}/> : null}</th>
                    <th scope="col" {...onHeaderClick("professor_id")}>professor id {sortColumn == "professor_id" ? <ArrowDownNarrowWide size={11}/> : null}</th>
                    <th scope="col" {...onHeaderClick("name")}>name {sortColumn == "name" ? <ArrowDownNarrowWide size={11}/> : null}</th>
                    <th scope="col" {...onHeaderClick("academic_year")}>academic year {sortColumn == "academic_year" ? <ArrowDownNarrowWide size={11}/> : null}</th>
                    <th scope="col" {...onHeaderClick("created_at")}>created at {sortColumn == "created_at" ? <ArrowDownNarrowWide size={11}/> : null}</th>
                    <th scope="col" {...onHeaderClick("is_active")}>is active {sortColumn == "is_active" ? <ArrowDownNarrowWide size={11}/> : null}</th>
                    <th scope="col" {...onHeaderClick("nbr_students")}> # students {sortColumn == "nbr_students" ? <ArrowDownNarrowWide size={11}/> : null}</th>
                    <th scope="col"> </th>
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
                        <tr key={group.group_id} style={{backgroundColor: group.is_active ? "#a4f9a1" : "#f9a1a1"}}>
                            <td>{i}</td>
                            <td>{group.group_id}</td>
                            <td>{editGroupId == group.group_id ? <select value={editedGroup[group.group_id]?.professor_id ?? group.professor_id} onChange={
                                (e) => setEditedGroup( old => ({
                                    ...old, [group.group_id]:{ ...old[group.group_id], professor_id: e.target.value}
                                }))}> 
                                    <option value=""> -- Select a professor -- </option>
                                    { (profList && profList.users.length > 0 ? (profList.users.map(
                                        e => <option key={e.id} value={String(e.id)}> {e.lastName}</option>
                                    )): (<option value="noprof"> There is no professor available</option>)) 
                                    }
                                </select>
                                : profList?.users?.find(u => u?.id === group?.professor_id)?.firstName}
                            </td>
                            <td> {editGroupId === group.group_id ? <input value={editedGroup[group.group_id]?.name ?? group.name} onChange={
                                (e) => setEditedGroup( old => ({ ...old, [group.group_id]:{...old[group.group_id], name: e.target.value} }))}
                            /> : group.name}
                            </td>
                            <td>{ editGroupId === group.group_id ? <input value={editedGroup[group.group_id]?.academic_year ?? group.academic_year} onChange={
                                (e) => setEditedGroup( old => ({...old, [group.group_id]:{...old[group.group_id], academic_year: e.target.value}}))}
                                /> : group.academic_year}
                            </td>
                            <td>{group.created_at}</td>
                            <td>{group.is_active ? "active" : "inactive"}</td>
                            <td>{group.student?.length}</td>
                            <td className="action">
                                    <div className="action_cell">
                                        <div className={`actionIcons ${edit === group.group_id ? "open" : ""}`}>
                                            <a key={group.group_id+1} className="action_btn" onClick={() => handleEditUserRow(group.group_id)}> <Pencil size={25} strokeWidth={1.5}/> </a>
                                            <a key={group.group_id+2} className="action_btn" onClick={() => handleDeleteUser(group.group_id)}> <Trash size={25} strokeWidth={1.5} /> </a>
                                        </div>
                                        <span key={group.group_id+3} className="ellipsis" onClick={() => setEdit(prev => (prev === group.group_id ? null : group.group_id))}> <EllipsisVertical size={25} strokeWidth={1.5} /> </span>
                                    </div>
                                </td>
                        </tr>
                    )
                ))}
            </tbody>
        </table>
    );
}


function GroupForm( { handleAddGroup, setGroupActivity, groupName, setGroupName, groupProfessorId, setGroupProfessorId,setGroupAcademicYear, profList, groupActivity}){
    return (
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
                        { profList && profList.users.length > 0 ? (profList.users.map(
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
        </form>);
}





const AdminPage = () => {
    const [unAuthUsers, setUnAuthUsers] = useState({users: []});
    const [authUsers, setAuthUsers] = useState({users: []});
    const [groupList, setGroupsList] = useState({groups: []});
    const [profList, setProfList] = useState({users: []});
    const [selectedUsers, setSelectedUsers] = useState([]);
    const { unauthorized, authorization, authorized } = useAuth();

    const [error, setError] = useState(null);
    const {errRef} = useRef();

    const [groupName, setGroupName] = useState("");
    const [groupAcademicYear, setGroupAcademicYear] = useState(0);
    const [groupProfessorId, setGroupProfessorId] = useState(0);
    const [groupActivity, setGroupActivity] = useState(false);

    const [editUserId, setEditUserID] = useState(null);
    const [editedUser , setEditedUser] = useState({});

    const [editGroupId, setEditGroupID] = useState(null);
    const [editedGroup , setEditedGroup] = useState({});

    useEffect(() => {
        fetchRequests();
        fetchAuthUsers();
        fetchGroups();
        fetchProfessors();
    }, []);

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
            setProfList(result.data);
            console.log("Here are the professors: ", result.data?.users?.find(u => u.id === 1).firstName);
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

    function handleEditUserRow(id){
        setEditUserID((currentID) => currentID === id ? null : id);
        console.log("clicked on user with id: ", id)
        return true;
    }

    function handleEditGroupRow(id){
        setEditGroupID((currentID) => currentID === id ? null : id);
        console.log("clicked on group with id: ", id)
        return true;
    }

    const handleSaveEdits = async (e, table) => {
        e.preventDefault();
        if( table == "users") {
            if (Object.keys(editedUser).length == 0 ) {
                console.log("No edited user.")
            } else {
                const response = await authService.update_user(editedUser);
                console.log("response from server: ", response.message);
            }
            setEditUserID(null);
            setEditedUser({});
            await fetchAuthUsers();
            return true;
        } 
        else if( table == "groups") {
            console.log("groups"); 
            if (Object.keys(editedGroup).length != 0) {
                console.log("the edited group id is: ", Object.keys(editedGroup[Object.keys(editedGroup)[0]]));
                const response = await groupService.update_group(editedGroup);
            } else {
                console.log("No group edited.");
            }
            setEditGroupID(null);
            setEditedGroup({});
            await fetchGroups();
            return true;
        }
        else {
            return true;
        }
    }

    const handleDeleteId = async(e, type, id) => {
        if (type === "user") {
            console.log("trying to cancel a user.");

        }
        return true;
    }




    return (
        <>
        <section className="adminSection">
            <div>
                <h1> Account requests </h1>
                <p ref={errRef} className={error ? "errmsg" : "offscreen"} aria-live="assertive"> {error} </p>
                <div className="table-container">
                    <RequestTables unAuthUsers={unAuthUsers} selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers}/>
                </div>
                <button
                    onClick={(e) => handleAuthorizeButton(e)}>
                    Authorize selected users.
                </button>
            </div>
            
            <div>
                <h1> Account authorized </h1>
                <p ref={errRef} className={error ? "errmsg" : "offscreen"} aria-live="assertive"> {error} </p>
                <div className="table-container">
                    <AuthorizedTable authUsers={authUsers} editUserId={editUserId} handleEditUserRow={handleEditUserRow} editedUser={editedUser} setEditedUser={setEditedUser} groupList={groupList} profList={profList}/>
                </div>
                <button onClick={(e) => handleSaveEdits(e, "users")} hidden={editUserId==null}> save edits </button>
            </div>
            <div>
                <p ref={errRef} className={error ? "errmsg" : "offscreen"} aria-live="assertive"> {error} </p>
                <GroupForm handleAddGroup={handleAddGroup} setGroupActivity={setGroupActivity} setGroupAcademicYear={setGroupAcademicYear} groupName={groupName} setGroupName={setGroupName} groupProfessorId={groupProfessorId} setGroupProfessorId={setGroupProfessorId} profList={profList} groupActivity={groupActivity}/>
            </div>
            <div>
                <h1> Groups: </h1>
                <p ref={errRef} className={error ? "errmsg" : "offscreen"} aria-live="assertive"> {error} </p>
                <div className="table-container">
                    <TableGroups groupList={groupList} editGroupId={editGroupId} handleEditGroupRow={handleEditGroupRow} editedGroup={editedGroup} setEditGroupID={setEditGroupID} setEditedGroup={setEditedGroup} profList={profList} />
                </div>
                <button onClick={(e) => handleSaveEdits(e, "groups")} hidden={editGroupId==null}> save edits </button>
            </div>
            

        </section>
        </>
    )
}

export default AdminPage;