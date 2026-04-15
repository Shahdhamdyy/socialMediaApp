export interface AuthResponse {
    user: {
        id: string;
        email: string;
        role: string;
    };
    tokens: any;
}