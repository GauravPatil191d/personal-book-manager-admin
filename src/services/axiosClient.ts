import axios from "axios";

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

/**
 * Request Interceptor
 */
axiosClient.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("accessToken");

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 */
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.log("Unauthorized");

            // Example:
            localStorage.removeItem("accessToken");
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default axiosClient;