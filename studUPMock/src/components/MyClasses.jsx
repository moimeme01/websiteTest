import { useState, useEffect } from "react";
import { groupService } from "../api/groups";

function MesClasses(){
    const [ myClasses, setMyClasses ] = useState({groups: []});
    const [ err, setErr ] = useState(null);

    useEffect(() => {
        try {
            const response = groupService.getMyClassrooms();
            setMyClasses(response.data);
        } catch (err) {
            setErr(err);
        }
    }, []);
    
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