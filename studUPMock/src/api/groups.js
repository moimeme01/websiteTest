import api from "./axios"


export const groupService = {

    async getGroupList() {
        try{
            console.log("trying to get the group list");
            const response = await api.get("/groups/list");
            console.log("All good, here's the group request response, ", response)
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
            const response = await api.post("/groups/newgroup", group_data);
            return response;
        } catch (err) {
            console.log("There was an error, ", err.response?.data);
        }
    },

    async getMyClassrooms(id){
        try{
            console.log("Getting the professor classrooms for id:", id);
            const response = await api.get("/groups/myclasses", {
                params: {id: Number(id)}
            });
            return response;
        } catch (err) {
            console.log("Error getting my classes", err.response?.data);
        }
    },

    async getClassroomStudents(groupID){
        try {
            console.log("Getting the students of the classroom with ID: ", groupID)
            const response = await api.get("/groups/classStudents", { 
                params: {groupID: Number(groupID)}
            });
            return response;
        } catch (err) {
            console.log(err)
            return err.response?.data;
        }
    },

    async getClassroomInfo(groupID){
        try {
            console.log("Getting the infos of the classroom with ID: ", groupID)
            const response = await api.get("/groups/classInfo", { 
                params: {groupID: Number(groupID)}
            });
            
            return response;
        } catch (err) {
            console.log(err)
            return err.response?.data;
        }
    },

    async update_group(group){
        try {
            console.log("Trying to edit a group (group API)...", group);
            const response = await api.put("/groups/update", group);
            return response;
        } catch (err) {
            console.log("Error updating a group: ", err);
            return err;
        }
    }



}

