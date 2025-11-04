export interface User {
  id: string;
  username: string;
  email: string;
  theme: 'light' | 'dark';
  created_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ThemeUpdateRequest {
  theme: 'light' | 'dark';
}
