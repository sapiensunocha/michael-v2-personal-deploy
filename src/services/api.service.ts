import axios, { AxiosInstance } from "axios";

class ApiService {
  private api: AxiosInstance;
  private static instance: ApiService;
  private BASE_URL = process.env.NEXT_PUBLIC_BASE_URL + "/api";
  
  private constructor() {
    this.api = axios.create({
      baseURL: this.BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem("refreshToken");
            const response = await this.refreshToken(refreshToken);

            if (response.data.accessToken) {
              localStorage.setItem("accessToken", response.data.accessToken);
              this.api.defaults.headers.common["Authorization"] =
                `Bearer ${response.data.accessToken}`;
              return this.api(originalRequest);
            }
          } catch (error) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/signin";
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      },
    );
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  public async login(email: string, password: string, verificationCode: string) {
    try {
      const response = await this.api.post("auth/signin", { email, password, verificationCode });
      this.setTokens(response.data);
      this.setUserInfo(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public async sendVerificationCode(email: string) {
    try {
      const response = await this.api.post("auth/sendVerificationCode", { email });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // update user profile
  public async updateUserProfile(userData: {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    location?: {
      latitude: number;
      longitude: number;
      locationType: string;
      label: string;
      address: string;
    };
  }) {
    const response = await this.api.put("user/me", userData);
    return response.data;
  }

  // google login
  public async googleLogin() {
    const response = await this.api.get("auth/google");
    return response.data;
  }

  public async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    location: {
      latitude: number;
      longitude: number;
    };
    verificationCode: string;
  }) {
    try {
      const response = await this.api.post("auth/signup", userData);
      this.setTokens(response.data);
      this.setUserInfo(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async uploadFile(file: FormData) {
    return await this.api.post("/file/upload", file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  private async refreshToken(refreshToken: string | null) {
    return await this.api.post("auth/refresh-token", { refreshToken });
  }

  public async getUser() {
    const response = await this.api.get("/user/me");
    return response.data;
  }

  private setTokens(data: { accessToken: string; refreshToken: string }) {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
  }
  private setUserInfo(data: { email: string, firstName: string, lastName: string }) {
    localStorage.setItem("email", JSON.stringify(data.email));
    localStorage.setItem("firstName", JSON.stringify(data.firstName));
    localStorage.setItem("lastName", JSON.stringify(data.lastName));
  }
  public logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
}

export default ApiService.getInstance();
