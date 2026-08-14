import { useEffect,useState } from "react";
import axios from "../api/axios";


const AdminPage = () => {
    const [unAuthUsers, setUnAuthUsers] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchRequests() {
            try{
                const requests = await axios.get('/requested', 
                    {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: true       
                    }
                );
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
            <p> {JSON.stringify(unAuthUsers)} </p>
        </section>
        </>
    )
}

export default AdminPage;