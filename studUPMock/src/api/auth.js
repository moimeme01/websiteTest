import api, { logoutRequest } from './axios';

export const authService = {
    async register(userData) {
        console.log("Trying to register data")
        console.log("Datas are : ", userData)
        const response = await api.post('/auth/register', userData);
        console.log("Finished Register")
        return response.data;
    },
    
    async login(username, password) {
        const response = await api.post('/auth/login', { username, password });
        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);
        // Le refresh_token est dans le cookie (automatique)
        return response.data;
    },
    
    async logout() {
        console.log("Calling out async loggout")
        return logoutRequest();
    },

    async get_profile() {
        const response = await api.get("/users/me");
        return response.data;
    }, 

    async get_pending_users() {
        console.log("get pending users function working");
        const response = await api.get("/users/requested");
        return response;
    },

    async get_authorized_users() {
        console.log("getting the authorized users");
        const response = await api.get("/users/authorized");
        return response;
    },

    async get_prof_list() {
        console.log("getting the professors list.");
        const response = await api.get("/users/getprofessors");
        return response;
    },

    async authorizing_users(listOfUsers) {
        const response = await api.put("/users/authorizing", listOfUsers);
        return response;
    },

    async update_user(updatedUser) {
        console.log("given input: ", updatedUser);
        const response = await api.put("/users/update", updatedUser);
        console.log(response)
        return response;
    },

    async refresh() {
        console.log("requesting to auth refresh")
        const response = await api.post('/auth/refresh', null, { skipAuthRefresh: true, });
        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);
        return response.data;
    },

    async delete_user(id) {
        try {
            console.log("Trying to delete user (API auth) ... ", id);
            const response = await api.delete("/users/delete", {
                params: {id: Number(id)}
            });
            return response.message;
        } catch (err) {
            console.log("There was an error deleting the user. ", err)
            return err.response?.data;
        }        
    },

    async add_students(listOfStudents) {
        console.log("Trying to add students to a classroom (API Auth) ... ", listOfStudents);
        const response = await api.post("/users/addList", listOfStudents);
        return response.data;
    
    },

    async getMyStudents(profID) {
        try{
            console.log("Trying to get the students from professor (API Auth) ... ", profID);
            const response = await api.get("/users/getMyStudents", { 
                params: {profID: Number(profID)}
            });
            return response?.data;
        } catch (err) {
            return (err.response)
        }
    },

    async restoreSession() {
        console.log("Trying to restore the session pt1")
        try {
            await this.refresh();
            const userdata = await this.get_profile();
            return userdata;
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('No active session');

                localStorage.removeItem('access_token');

                return null;
            }
            console.error("No valid session to restore");
            localStorage.removeItem("access_token");
            return null;
        }
    },
};

