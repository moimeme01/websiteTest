import { useState, useEffect } from "react";
import { groupService } from "../api/groups";
import { authService } from "../api/auth";

const MesClasses = () => {
    const [ me, setMe] = useState(null);
    const [ myClasses, setMyClasses ] = useState({groups: []});
    const [ err, setErr ] = useState(null);

    useEffect(() => {
        fetchMe();
    }, []);

    useEffect(() => {
        fetchMyClasses(me)
    }, [me]);

    async function fetchMe(){
        try {
            console.log("Getting my ID in classes")
            const response = await authService.get_profile();
            setMe(response);
        } catch (err) {
            console.log("Erron in getting me, my classes: ", err)
            setErr(err.response?.data?.message);
        }
    }

    async function fetchMyClasses(me){
        try {
            console.log("Getting my classes in myclasses")
            const response = await groupService.getMyClassrooms(me.id);
            setMyClasses(response.data);
        } catch (err) {
            console.log("Erron in getting me, my classes: ", err)
            setErr(err.response?.data?.message);
        }
    }
    
    return (
        <>
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
                        {myClasses.groups.at(0) == null ? (
                            <tr>
                                <td colSpan={7}>
                                    No group available
                                </td>
                            </tr>
                        ) : ( 
                        myClasses.groups.map((group, i) => (
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
        </>
    );

}



export default MesClasses;