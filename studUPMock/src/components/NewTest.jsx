import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { examsService } from "../api/exams";

const NewTest = () => {

    const { profID } = useParams();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [level, setLevel] = useState();
    const [chapter, setChapter] = useState("");

    const [estimated_duration, setEstimatedDuration] = useState();
    const [openingDate, setOpeningDate] = useState();
    const [closingDate, setClosingDate] = useState();
    const [editOrder, setEditOrder] = useState(Boolean);
    const [showResult, setShowResult] = useState(Boolean);

    const navigate = useNavigate();

    async function handleSaveTest() {
        try{
            console.log("adding the data")
            const test ={
                professor_id: Number(profID),
                title: title,
                description: description,
                level: Number(level),
                chapter : chapter,
                estimated_duration : Number(estimated_duration),
                opening_date : openingDate,
                closing_date : closingDate,
                random_question_order : editOrder,
                show_score : Boolean(showResult),
            }
            const response = await examsService.newTest(test);
            console.log("Test successfully added")
            navigate("/professor/mestests")
            return response.data;
        } catch (err) {
            console.log(error);
            return err;
        }
        
    }




    return (
        <>
        <h1>New Test</h1>
        <div>
            <form className="register-form">
                <fieldset className="form-section">
                    <legend> A. Informations générales</legend>
                    <div className="form-field">
                        <label> Titre </label>
                        <input 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)} 
                        />
                    </div>
                    <div className="form-field">
                        <label> Chapitre </label>
                        <input 
                            value={chapter}
                            onChange={(e) => setChapter(e.target.value)} 
                        />
                    </div>
                    <div className="form-field">
                        <label> Niveau </label>
                        <select onChange={(e) => setLevel(e.target.value)}>
                            <option value=""> -- Choisissez un niveau -- </option>
                            <option value={1}> Niveau 1 </option> 
                            <option value={2}> Niveau 2 </option> 
                            <option value={3}> Niveau 3 </option> 
                        </select>
                    </div>
                    <div className="form-field">
                        <label> Description </label>
                        <input 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)} 
                        />
                    </div>
                </fieldset>

                <fieldset className="form-section">
                    <legend> B. Contenu du test</legend>
                </fieldset>

                <fieldset className="form-section">
                    <legend> C. Assignation </legend>
                </fieldset>

                <fieldset className="form-section">
                    <legend> D. Paramètres </legend>
                    <div className="form-field">
                        <label> Durée estimée </label>
                        <input 
                            
                            value={estimated_duration}
                            onChange={(e) => setEstimatedDuration(e.target.value)} 
                        />
                    </div>
                    <div className="form-field">
                        <label> Ouverture </label>
                        <input
                            type="date" 
                            value={openingDate}
                            onChange={(e) => setOpeningDate(e.target.value)} 
                        />
                    </div>
                    <div className="form-field">
                        <label> Fermeture </label>
                        <input 
                            type="date"
                            value={closingDate}
                            onChange={(e) => setClosingDate(e.target.value)} 
                        />
                    </div>
                    <div className="form-field">
                        <label> Modifier l'ordre du test </label>
                        <input 
                            type="checkbox"
                            checked={editOrder}
                            onChange={(e) => setEditOrder(e.target.value)} 
                        />
                    </div>
                    <div className="form-field">
                        <label> Afficher le score </label>
                        <input 
                            type="checkbox"
                            checked={showResult}
                            onChange={(e) => setShowResult(e.target.value)} 
                        />
                    </div>
                </fieldset>
                
            </form>
            <button className="field-button" onClick={handleSaveTest}> Valider </button>
        </div>
        </>
    );
}

export default NewTest;