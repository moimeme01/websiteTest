import { useState, useEffect } from "react";
import { examsService } from "../api/exams";
import { authService } from "../api/auth";
import { useNavigate } from "react-router-dom";

const MesExamens = () => {
    const [ me, setMe] = useState(null);
    const [ myTests, setMyTests ] = useState({exams: []});
    const [ err, setErr ] = useState(null);
    const  navigate  = useNavigate();
    
    useEffect(() => {
        fetchMe();
    }, []);

    useEffect(() => {
        fetchMyTests(me)
    }, [me]);

    async function fetchMe(){
        try {
            console.log("Getting my ID")
            const response = await authService.get_profile();
            setMe(response);
        } catch (err) {
            console.log("Error in getting me: ", err)
            setErr(err.response?.data?.message);
        }
    }

    async function fetchMyTests(me) {
        try {
            console.log("Getting my tests ... ");
            const id = me.id;
            const result = await examsService.getMyTests(id);
            console.log(result)
            setMyTests(result.data);
        } catch (err) {
            console.log("Error getting my tests: ", err)
        }
    }

    function convertDate(date){
        const interDate = new Date(date)
        const formattedDate = new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour:'2-digit',
            minute:'2-digit',
            hour12: false
        }).format(interDate).replace(',', ' ')
        return formattedDate
    }

    
    return (
        <>
            <div className="table-container">
                <table className="adminTable">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">exam id</th>
                            <th scope="col">title </th>
                            <th scope="col">description </th>
                            <th scope="col">chapter </th>
                            <th scope="col">level </th>
                            <th scope="col">created at </th>
                            <th scope="col">estimated duration (minutes)</th>
                            <th scope="col">opening date </th>
                            <th scope="col">closing date </th>
                            <th scope="col">random question order </th>
                            <th scope="col">show score </th>
                        </tr>
                    </thead>
                    <tbody>
                        {myTests.exams.at(0) == null ? (
                            <tr>
                                <td colSpan={99}>
                                    No tests available
                                </td>
                            </tr>
                        ) : ( 
                        myTests.exams.map((test, i) => (
                                <tr key={test.exam_id}style={{backgroundColor: test.is_open ? "#a4f9a1" : "#f9a1a1"}} onClick={() => navigate(`/professor/mytests/${test.exam_id}`)}>
                                    <td>{i}</td>
                                    <td>{test.exam_id}</td>
                                    <td>{test.title}</td>
                                    <td>{test.description}</td>
                                    <td>{test.chapter}</td>
                                    <td>{test.level}</td>
                                    <td>{convertDate(test.created_at)}</td>
                                    <td>{test.estimated_duration}</td>
                                    <td>{convertDate(test.opening_date)}</td>
                                    <td>{convertDate(test.closing_date)}</td>
                                    <td>{String(test.random_question_order)}</td>
                                    <td>{String(test.show_score)}</td>
                                </tr>
                            )
                        ))}
                    </tbody>
                </table>
            </div>
            <button onClick={() => navigate(`/professor/newtest/${me.id}`)}> Add new test </button>
        </>
    );

}



export default MesExamens;