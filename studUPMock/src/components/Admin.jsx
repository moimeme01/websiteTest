import { useEffect,useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";


const AdminPage = () => {
    const [unAuthUsers, setUnAuthUsers] = useState({users: []});
    const [authUsers, setAuthUsers] = useState({users: []});
    const [selectedUsers, setSelectedUsers] = useState([]);
    const { unauthorized, authorization, authorized } = useAuth();
    const [error, setError] = useState(null);
    
    async function fetchAuthUsers() {
        try{
            const requests = await authorized();
            console.log("here is the result of the request: ")
            console.log(requests)
            setAuthUsers(requests.data);
            console.log(unAuthUsers)
            console.log(unAuthUsers.users)
            if (unAuthUsers.users.at(0) == null) {
                console.log('no unauth users');
            }

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

        } catch (err) {
            if (err) {
                setError(err);
            }
        }
    };

    useEffect(() => {
        fetchRequests();
        fetchAuthUsers();
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

        </section>
        </>
    )
}

export default AdminPage;