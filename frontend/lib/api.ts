import axios from "axios";
import { getToken } from "./auth";
import { TokenResponse, User, Profile, Internship, Recommendation } from "@/types";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    headers: { "Content-Type": "application/json" },
});

// Attach JWT Bearer token to every request automatically
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth
export const register = (name: string, email: string, password: string) =>
    api.post<TokenResponse>("/api/auth/register", { name, email, password });

export const login = (email: string, password: string) =>
    api.post<TokenResponse>("/api/auth/login", { email, password });

export const logout = () => api.post("/api/auth/logout");

export const getMe = () => api.get<User>("/api/auth/me");

// Profile
export const getProfile = () => api.get<Profile>("/api/profile");

export const saveProfile = (data: Partial<Profile>) =>
    api.post<Profile>("/api/profile", data);

// Internships
export const getInternships = (params?: {
    domain?: string;
    mode?: string;
    location?: string;
}) => api.get<Internship[]>("/api/internships", { params });

// Recommendations
export const getRecommendations = () =>
    api.get<{ recommendations: Recommendation[]; total: number }>(
        "/api/recommendations"
    );

export default api;
