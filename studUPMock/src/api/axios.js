import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials:true
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, 
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const response = await axios.post("/auth/refresh", {}, {withCredentials: true});
                const { access_token } = response.data;
                localStorage.setItem("access_token", access_token);

                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Could not refresh => logout
                localStorage.removeItem("access_token");
                window.location.href("/login");
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);



export default api;