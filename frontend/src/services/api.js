import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // e.g., http://localhost:5000/api
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const registerUser = async (name, email, password) => {
    return await api.post("/auth/register", { name, email, password });
};

export const loginUser = async (email, password) => {
    return await api.post("/auth/login", { email, password });
};

export const getSkills = async () => {
    return await api.get("/skills");
};

export const createSkill = async (skillData) => {
    return await api.post("/skills", skillData);
};

export const createBooking = async (bookingData) => {
    return await api.post("/bookings", bookingData);
};

export const getMyBookings = async () => {
    return await api.get("/bookings/my");
};

export default api;
