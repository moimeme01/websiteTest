import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials:true
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");


    console.log("Request URL:", config.url);
    console.log("Token exists:", Boolean(token));


    if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;