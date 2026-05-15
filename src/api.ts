const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
    name: string;
    role: string;
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
    role: string;
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

  private getHeadersWithoutContentType(): HeadersInit {
    const token = localStorage.getItem("authToken");
    return {
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private extractErrorMessage(error: ApiError): string {
    if (error.error) {
      return error.error;
    }

    if (error.errors && typeof error.errors === "object") {
      const errors = error.errors as any;
      
      if (errors.fieldErrors && typeof errors.fieldErrors === "object") {
        const fieldErrors = errors.fieldErrors;
        const errorMessages: string[] = [];
        
        for (const [field, messages] of Object.entries(fieldErrors)) {
          if (Array.isArray(messages) && messages.length > 0) {
            errorMessages.push(`${field}: ${messages[0]}`);
          }
        }
        
        if (errorMessages.length > 0) {
          return errorMessages.join(", ");
        }
      }
    }

    return "An error occurred";
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const body = { email, password };
    console.log("Sending login request:", body);
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      const errorMessage = this.extractErrorMessage(error);
      console.error("Login error response:", error);
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async register(
    name: string,
    email: string,
    username: string,
    password: string,
    phone: string,
    role: string = "GUEST"
  ): Promise<RegisterResponse> {
    const body = { name, email, username, password, phone, role };
    console.log("Sending register request:", body);
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      const errorMessage = this.extractErrorMessage(error);
      console.error("Register error response:", error);
      throw new Error(errorMessage);
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

  async updateProfile(data: {
    name?: string;
    username?: string;
    phone?: string;
    bio?: string;
    avatar?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      const errorMessage = this.extractErrorMessage(error);
      console.error("Update profile error:", error);
      throw new Error(errorMessage);
    }

    const result = await response.json();
    localStorage.setItem("user", JSON.stringify(result.user));
    return result;
  }

  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      const errorMessage = this.extractErrorMessage(error);
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/users/upload-avatar`, {
      method: "POST",
      headers: this.getHeadersWithoutContentType(),
      body: formData,
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      const errorMessage = this.extractErrorMessage(error);
      console.error("Upload avatar error:", error);
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async createListing(data: {
    title: string;
    description: string;
    location: string;
    pricePerNight: number;
    guests: number;
    type: string;
    amenities?: string[];
    bedrooms?: number;
    bathrooms?: number;
    image?: string;
  }) {
    const user = this.getUser();
    if (!user) throw new Error("User not authenticated");

    const response = await fetch(`${API_BASE_URL}/listings`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({
        ...data,
        userId: user.id,
      }),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      const errorMessage = this.extractErrorMessage(error);
      console.error("Create listing error:", error);
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async getListings(page: number = 1, limit: number = 10) {
    const response = await fetch(
      `${API_BASE_URL}/listings?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      const error: ApiError = await response.json();
      const errorMessage = this.extractErrorMessage(error);
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async getListingById(id: string) {
    const response = await fetch(`${API_BASE_URL}/listings/${id}`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      const errorMessage = this.extractErrorMessage(error);
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async createBooking(data: {
    listingId: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    total: number;
  }) {
    const user = this.getUser();
    if (!user) throw new Error("User not authenticated");

    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({
        ...data,
        userId: user.id,
      }),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      const errorMessage = this.extractErrorMessage(error);
      console.error("Create booking error:", error);
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async getMyBookings() {
    const user = this.getUser();
    if (!user) throw new Error("User not authenticated");

    const response = await fetch(`${API_BASE_URL}/users/${user.id}/bookings`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      const errorMessage = this.extractErrorMessage(error);
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async getMyListings() {
    const user = this.getUser();
    if (!user) throw new Error("User not authenticated");

    const response = await fetch(`${API_BASE_URL}/users/${user.id}/listings`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      const errorMessage = this.extractErrorMessage(error);
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async updateListing(id: string, data: {
    title?: string;
    description?: string;
    location?: string;
    pricePerNight?: number;
    guests?: number;
    type?: string;
    amenities?: string[];
    bedrooms?: number;
    bathrooms?: number;
    image?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/listings/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      const errorMessage = this.extractErrorMessage(error);
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async deleteListing(id: string) {
    const response = await fetch(`${API_BASE_URL}/listings/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      const errorMessage = this.extractErrorMessage(error);
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async getBookingById(id: string) {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      const errorMessage = this.extractErrorMessage(error);
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async cancelBooking(id: string) {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}/cancel`, {
      method: "POST",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      const errorMessage = this.extractErrorMessage(error);
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async getReviews() {
    const user = this.getUser();
    if (!user) throw new Error("User not authenticated");

    const response = await fetch(`${API_BASE_URL}/users/${user.id}/reviews`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      const errorMessage = this.extractErrorMessage(error);
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async createReview(data: {
    bookingId: string;
    rating: number;
    comment: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      const errorMessage = this.extractErrorMessage(error);
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async getMessages() {
    const user = this.getUser();
    if (!user) throw new Error("User not authenticated");

    const response = await fetch(`${API_BASE_URL}/users/${user.id}/messages`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      const errorMessage = this.extractErrorMessage(error);
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async sendMessage(data: {
    recipientId: string;
    content: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      const errorMessage = this.extractErrorMessage(error);
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async getWallet() {
    const user = this.getUser();
    if (!user) throw new Error("User not authenticated");

    const response = await fetch(`${API_BASE_URL}/users/${user.id}/wallet`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      const errorMessage = this.extractErrorMessage(error);
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async withdrawFromWallet(amount: number) {
    const response = await fetch(`${API_BASE_URL}/wallet/withdraw`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      const errorMessage = this.extractErrorMessage(error);
      throw new Error(errorMessage);
    }

    return response.json();
  }
}

export const apiService = new ApiService();
