import api from './axios';

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
        await api.post('/auth/logout');
        localStorage.removeItem('access_token');
    },

    async get_profile() {
        const response = await api.get("/users/me");
        return response.data;
    }, 

    async get_pending_users() {
        console.log("get pending users function working")
        const response = await api.get("/users/requested")
        return response;
    },

    async refresh() {
        const response = await api.post('/auth/refresh');
        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);
        return response.data;
    },

    async restoreSession() {
        try {
            await this.refresh();
            const userdata = await this.get_profile();
            return userdata;
        } catch (error) {
            console.log("No valid session to restore");
            localStorage.removeItem("access_token");
            return null;
        }
    },
};

