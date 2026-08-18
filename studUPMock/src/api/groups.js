import api from "./axios"


export const groupService = {

    async getGroupList() {
        try{
            console.log("trying to get the group list");
            const response = await api.get("/groups/list");
            console.log("All good, here's the group request resposne, ", response)
            return response;
        } catch (err) {
            console.log("there was an error", err);
            if (err) {
                setError(err);
            }
        }
    },

    async addNewGroup(group_data) {
        console.log("Adding")
        try{
            console.log("trying to put a new group");
            console.log(group_data);
            const response = await api.post("/groups/newgroup", group_data);
            return response;
        } catch (err) {
            console.log("There was an error, ", err.response?.data);
        }
    },

}

