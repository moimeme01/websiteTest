import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials:true
})

let refreshPromise = null; 
let isLoggingOut = false; 

function isAuthEndpoint(url = '') {
    return (
        url.includes('/auth/login') || url.includes('/auth/logout') || url.includes('/auth/refresh')
    );
}

function get_accesstoken(){
    return localStorage.getItem("access_token");
}

function save_accesstoken(token){
    localStorage.setItem("access_token", token);
}

function remove_accesstoken() {
    localStorage.removeItem("access_token");
}

async function refreshAccessToken(){
    if (!refreshPromise) {
        refreshPromise = api.post("auth/refresh", null, {skipAuthRefresh: true,}).then(
            (response) => {
                const newAccessToken = response.data.access_token;

                if (!newAccessToken) {
                    throw new Error("No access token returned by refresh endpoint")
                }
                save_accesstoken(newAccessToken);
                return newAccessToken
            }).finally(() => { refreshPromise = null; });
    }
    return refreshPromise;
}


api.interceptors.request.use((config) => {
    const token = get_accesstoken();

    if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;

}, (error) => {
    return Promise.reject(error);
});


api.interceptors.response.use(
    (response) => { return response; }, 
    
    async (error)  => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const requestUrl = originalRequest?.url || '';

        if (!originalRequest) {
            return Promise.reject(error);
        }

        const shouldNotRefresh = 
            status !== 401 ||
            isAuthEndpoint(requestUrl) ||
            originalRequest.skipAuthRefresh === true ||
            originalRequest._retry === true ||
            isLoggingOut;

        if (shouldNotRefresh) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            const newAccessToken = await refreshAccessToken();
            
            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;

            return api(originalRequest);
            
        } catch (refreshError) {
            remove_accesstoken('access_token');
            return Promise.reject(refreshError);
        }
    }
);

export async function logoutRequest() {
  isLoggingOut = true;

  try {
    await api.post('/auth/logout', null, {
      skipAuthRefresh: true,
    });
  } finally {
    removeAccessToken();
    refreshPromise = null;
    isLoggingOut = false;
  }
}


export default api;