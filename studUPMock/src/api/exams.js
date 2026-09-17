import api from "./axios"

export const examsService = {

    async getMyTests(id) {
        try {
            console.log("Trying to get the exams for the prof id: ", id)
            const response = await api.get("/exams/getMyExams", {
                params: {profID: Number(id)}
            });
            return response;
        } catch(err) {
            console.log("Error: ", err)
            return ("Error ", err)
        }
    },

    async newTest(test) {
        try {
            console.log("Trying to create new exam: ", test);
            const response = await api.post("/exams/newExam", test)
            return response;
        } catch (err) {
            console.log(err);
            return err;
        }
    },


    async getTest(id) {
        try {
            console.log("Trying to get the exam with id: ", id)
            const response = await api.get("/exams/getExam", {
                params: {testID: Number(id)}
            });
            return response;
        } catch(err) {
            console.error("Status:", err.response?.status);
            console.error("FastAPI response:", err.response?.data);
            console.error("Detail:", err.response?.data?.detail);
            console.log("Error: ", err)
            return ("Error ", err)
        }
    },

    async getQuestions(id) {
        try {
            console.log("Trying to get the questions for test with id: ", id)
            const response = await api.get("/questions/getQuestions", {
                params: {examID: Number(id)}
            });
            return response;
        } catch(err) {
            console.error("Status:", err.response?.status);
            console.error("FastAPI response:", err.response?.data);
            console.error("Detail:", err.response?.data?.detail);
            console.log("Error: ", err)
            return ("Error ", err)
        }
    },

    async addquestion(listOfQuestions) {
        try {
            console.log("Trying to add a question to the exam ... ", listOfQuestions)
            const response = await api.post("/questions/newquestion", listOfQuestions);
            return response;
        } catch(err) {
            console.log("Error: ", err)
            console.error("Status:", err.response?.status);
            console.error("FastAPI response:", err.response?.data);
            console.error("Detail:", err.response?.data?.detail);
            return ("Error ", err)
        }
    },

    async deleteQuestion(id) {
        try {
            console.log("Trying to delete a question ... ", id)
            const response = await api.delete("/questions/delete", {
                params: {question_id: id}
            });
            return response;
        } catch(err) {
            console.log("Error: ", err)
            console.error("Status:", err.response?.status);
            console.error("FastAPI response:", err.response?.data);
            console.error("Detail:", err.response?.data?.detail);
            return ("Error ", err)
        }
    },

    async editQuestion(updateQuestion) {
        try {
            console.log("Trying to delete a question ... ", updateQuestion)
            const response = await api.put("/questions/edit", updateQuestion);
            return response;
        } catch(err) {
            console.log("Error: ", err)
            console.error("Status:", err.response?.status);
            console.error("FastAPI response:", err.response?.data);
            console.error("Detail:", err.response?.data?.detail);
            return ("Error ", err)
        }
    },

    async getAffectations(id) {
        try {
            console.log("getting affectations for: ", id)
            const response = await api.get("affectation/getaffectations", {
                params: {exam_id: id}
            })
            return response
        } catch (err) {
            console.log("Error: ", err)
            console.error("Status:", err.response?.status);
            console.error("FastAPI response:", err.response?.data);
            console.error("Detail:", err.response?.data?.detail);
        }
    },

    async newAffectation(data){
        try{
            console.log("Adding affectations of data: ", data)
            const response = await api.post("affectation/newaffectation", data);
            return response;
        } catch (err) {
            console.log("Error: ", err)
            console.error("Status:", err.response?.status);
            console.error("FastAPI response:", err.response?.data);
            console.error("Detail:", err.response?.data?.detail);
        }
    }
}