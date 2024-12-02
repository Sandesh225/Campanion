import axios from "axios";
import * as Keychain from "react-native-keychain";

const API_BASE_URL = "http://localhost:3000/api"; // Update with your backend URL

interface RegisterResponse {
  statusCode: number;
  data: {
    id: string;
    username: string;
    email: string;
    accessToken: string;
    refreshToken: string;
  };
  message: string;
  errors: any[];
  success: boolean;
}

interface LoginResponse {
  statusCode: number;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      username: string;
      email: string;
    };
  };
  message: string;
  errors: any[];
  success: boolean;
}

export const register = async (
  username: string,
  email: string,
  password: string
): Promise<RegisterResponse> => {
  try {
    const response = await axios.post<RegisterResponse>(
      `${API_BASE_URL}/auth/register`,
      {
        username,
        email,
        password,
      }
    );

    if (response.data.success) {
      // Store tokens securely using Keychain
      await Keychain.setGenericPassword(email, response.data.data.accessToken, {
        service: "accessToken",
      });
      await Keychain.setGenericPassword(
        email,
        response.data.data.refreshToken,
        {
          service: "refreshToken",
        }
      );
    }

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Registration failed");
    } else {
      throw new Error("Network error");
    }
  }
};

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/auth/login`,
      {
        email,
        password,
      }
    );

    if (response.data.success) {
      // Store tokens securely using Keychain
      await Keychain.setGenericPassword(email, response.data.data.accessToken, {
        service: "accessToken",
      });
      await Keychain.setGenericPassword(
        email,
        response.data.data.refreshToken,
        {
          service: "refreshToken",
        }
      );
    }

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Login failed");
    } else {
      throw new Error("Network error");
    }
  }
};

export const logout = async (): Promise<void> => {
  try {
    await Keychain.resetGenericPassword({ service: "accessToken" });
    await Keychain.resetGenericPassword({ service: "refreshToken" });
  } catch (error) {
    console.error("Error resetting Keychain:", error);
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: "accessToken",
    });
    if (credentials) {
      return credentials.password;
    }
    return null;
  } catch (error) {
    console.error("Error retrieving access token:", error);
    return null;
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: "refreshToken",
    });
    if (credentials) {
      return credentials.password;
    }
    return null;
  } catch (error) {
    console.error("Error retrieving refresh token:", error);
    return null;
  }
};
