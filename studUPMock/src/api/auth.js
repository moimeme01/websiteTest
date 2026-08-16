import api, { logoutRequest } from './axios';

export const authService = {
    async register(userData) {
        const response = await api.post('/auth/register', userData);
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
        await logoutRequest;
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

    async authorizing_users(listOfUsers) {
        const response = await api.put("/users/authorizing", listOfUsers);
        return response;
    },

    async refresh() {
        console.log("requesting to auth refresh")
        const response = await api.post('/auth/refresh', null, { skipAuthRefresh: true, });
        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);
        return response.data;
    },

    async restoreSession() {
        console.log("Trying to restore the session pt1")
        try {
            await this.refresh();
            const userdata = await this.get_profile();
            return userdata;
        } catch (error) {
            if (status === 401) {
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

