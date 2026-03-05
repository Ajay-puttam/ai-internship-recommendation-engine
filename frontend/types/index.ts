export interface User {
    id: string;
    name: string;
    email: string;
    created_at: string;
}

export interface Profile {
    user_id: string;
    degree?: string;
    branch?: string;
    college?: string;
    skills: string[];
    interests: string[];
    location_preference?: string;
    internship_mode?: "remote" | "onsite" | "hybrid";
}

export interface Internship {
    id: string;
    title: string;
    company: string;
    domain?: string;
    skills_required: string[];
    description?: string;
    location?: string;
    mode?: string;
    duration?: string;
    stipend?: string;
    apply_link?: string;
    source?: string;
}

export interface Recommendation extends Internship {
    match_score: number;
    reasons: string[];
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}
