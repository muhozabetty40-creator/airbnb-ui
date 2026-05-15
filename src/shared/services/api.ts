const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
    name: string;
  };
}

export interface RegisterResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
    name: string;
  };
}

export interface ApiError {
  error?: string;
  errors?: Record<string, unknown>;
  message?: string;
}

class ApiService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || "Login failed");
    }

    return response.json();
  }

  async register(
    name: string,
    email: string,
    username: string,
    password: string,
    phone: string
  ): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ name, email, username, password, phone }),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || "Registration failed");
    }

    return response.json();
  }

  logout(): void {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  }

  getToken(): string | null {
    return localStorage.getItem("authToken");
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
}

export const apiService = new ApiService();
