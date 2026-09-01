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

}