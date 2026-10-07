import { useEffect, useState } from "react";
import { data, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { examsService } from "../api/exams";
import { authService } from "../api/auth";
import { groupService } from "../api/groups";
import { Info } from "lucide-react";

const TITLE_REGEX = /^[A-Za-z]{4,12}$/

function get_cookie(name){
    let cookieName = name + "=";
    let cookieArray = document.cookie.split(";")

    for (const i in cookieArray) {
        const element = cookieArray[i];
        if (element.startsWith(cookieName, 0)){
            return element.split("=")[1]
        }
    }
}



const NewTest = () => {

    let prof_id = get_cookie("prof_id");
    const [myClasses, setMyClasses] = useState({groups: []})
    const [myStudents, setMyStudents] = useState({users: []});

    useEffect(() => {
        fetchMyClasses(prof_id);
        fetchMyUsers(prof_id);
    }, [prof_id]);

    async function fetchMyClasses(id) {
        try {
            const result = await groupService.getMyClassrooms(id);
            setMyClasses(result.data);
        } catch (err) {
            console.log("There was an error getting the classes: ", err);
        }
    }

    async function fetchMyUsers(id){
        try {
            const result = await authService.getMyStudents(id);
            setMyStudents(result)
        } catch (err) {
            console.log("There was an error getting my students: ", err)
        }
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode:"onBlur",
        defaultValues: {
            title:"",
            description:"",
            level:0,
            chapter:"",
            estimated_duration:"",
            opening_date:"",
            closing_date:"",
            editOrder:"",
            showResult:"",
        },
    })
    
    const navigate = useNavigate();

    const validateTitle = (value) => {
        if (!value) {return "Titre requis";}
        if (!TITLE_REGEX.test(value)){
            return "Le titre doit commencer par une majuscule, contenir uniquement des lettres, et max 12 caractères";
        }
        return true;
    };

    const validateChapter = (value) => {
        if (!value) {return "Chapitre requis";}
        if (!TITLE_REGEX.test(value)){
            return "Le chapitre doit commencer par une majuscule, contenir uniquement des lettres, et max 12 caractères";
        }
        return true;
    };


    async function handleSaveTest(data) {
        try{
            console.log("adding the data")
            console.log(data)
            const test ={
                professor_id: Number(prof_id),
                title: data.title,
                description: data.description,
                level: Number(data.level),
                chapter : data.chapter,
                estimated_duration : Number(data.estimated_duration),
                opening_date : data.opening_date,
                closing_date : data.closing_date,
                random_question_order : data.editOrder,
                show_score : Boolean(data.showResult),
            }
            
            const response = await examsService.newTest(test);
            console.log("Test successfully added")
            navigate("/professor/mestests")
            return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
        
    }


    const submitForm = (data) => {
        console.log(data);
        handleSaveTest(data);
    }

    const onError = (err) => {
        console.error(err);
    }

    return (
        <>
        <h1>New Test</h1>
        <div>
            <form className="newtest-form" onSubmit={handleSubmit(submitForm, onError)}>
                <fieldset className="form-section">
                    <legend> A. Informations générales</legend>
                    <div className="form-field">
                        <label> Titre </label>
                        <input 
                            id="title"
                            aria-invalid={!!errors.title}
                            aria-describedby={errors.title ? "title-error" : undefined}
                            {...register("title", { validate: validateTitle })}
                        />
                        {errors.title && (
                            <p id="title-error" className="instructions">
                                <Info size={12} /> {errors.title.message}
                            </p>
                        )}
                    </div>
                    <div className="form-field">
                        <label> Chapitre </label>
                        <input 
                            id="chapter"
                            aria-invalid={!!errors.chapter}
                            aria-describedby={errors.chapter ? "chapter-error" : undefined}
                            { ...register("chapter", {validate: validateChapter})}
                        />
                        {errors.chapter && (
                            <p id="chapter-error" className="instructions"> 
                                <Info size={12} /> {errors.chapter.message}
                            </p>
                        )}
                    </div>
                    <div className="form-field">
                        <label> Niveau </label>
                        <select { ...register("level")}>
                            <option value=""> -- Choisissez un niveau -- </option>
                            <option value={1}> Niveau 1 </option> 
                            <option value={2}> Niveau 2 </option> 
                            <option value={3}> Niveau 3 </option> 
                        </select>
                    </div>
                    <div className="form-field">
                        <label> Description </label>
                        <input 
                            id="chapter"
                            aria-invalid={!!errors.description}
                            aria-describedby={errors.description ? "description-error" : undefined}
                            { ...register("description")}
                        />
                    </div>
                </fieldset>

                <fieldset className="form-section">
                    <legend> B. Assignation </legend>
                    <div className="form-field"> 
                            {myStudents?.users.map((user, i) => (
                                <span className="form-field-line"> {user.firstName} : <input key={i} type="checkbox"/> </span>
                            ))}
                    </div>
                    <div className="form-field">
                        <div className="form-field-grid"> 
                            {myClasses.groups.map((group, i) => (
                                <span className="form-field-line"> {group.name} : <input key={i} type="checkbox"/> </span>
                            ))}
                        </div>
                    </div>
                </fieldset>

                <fieldset className="form-section">
                    <legend> C. Contenu du test</legend>
                </fieldset>

                <fieldset className="form-section">
                    <legend> D. Paramètres </legend>
                    <div className="form-field">
                        <label> Durée estimée (en minutes) </label>
                        <input 
                            { ...register("estimated_duration")} 
                        />
                    </div>
                    <div className="form-field">
                        <label> Ouverture </label>
                        <input
                            type="datetime-local" 
                            { ...register("opening_date")}
                        />
                    </div>
                    <div className="form-field">
                        <label> Fermeture </label>
                        <input 
                            type="datetime-local"
                            { ...register("closing_date")}
                        />
                    </div>
                    <div className="form-field">
                        <label> Modifier l'ordre du test </label>
                        <input 
                            type="checkbox"
                            { ...register("editOrder")}
                        />
                    </div>
                    <div className="form-field">
                        <label> Afficher le score </label>
                        <input 
                            type="checkbox"
                            { ...register("showResult")} 
                        />
                    </div>
                </fieldset>
                <button className="field-button" > Valider </button>
            </form>
        </div>
        </>
    );
}

export default NewTest;