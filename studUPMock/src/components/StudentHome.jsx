import { useEffect, useState } from "react";
import { authService } from "../api/auth";
import { groupService } from "../api/groups";


const UserConnected = () => {
    const [me, setMe] = useState(null);
    const [myClassroom, setMyClassroom] = useState(null);
    const [myTests, setMyTests] = useState(null);

    useEffect(() => {
        fetchMe()
    }, [])

    async function fetchMe() {
        const result = await authService.get_profile()
        setMe(result)
        setMyClassroom(result?.classroom)
        return true;
    }

    return (
        <>
        <section>
            <h1>
                Bienvenue {me?.firstName}.
            </h1>
        </section>
        <section> 
            Ma classe: {myClassroom?.name}
        </section>
        </>
    )
}

export default UserConnected;