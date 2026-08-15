import { useEffect,useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";


const AdminPage = () => {
    const [unAuthUsers, setUnAuthUsers] = useState({users: null});
    const { unauthorized } = useAuth();
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchRequests() {
            try{
                const requests = await unauthorized();
                console.log("here is the result of the request: ")
                console.log(requests)
                setUnAuthUsers(requests.data);

            } catch (err) {
                if (err) {
                    setError(err);
                }
            }
        }
        fetchRequests();

        return () => {};
    }, []);

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
                        {unAuthUsers.users === null ? (
                            <tr>
                                <td colSpan={9}>
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
                                    <td></td>
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