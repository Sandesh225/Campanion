// src/utils/keychain.ts
import * as Keychain from "react-native-keychain";

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

/**
 * Store tokens securely in Keychain
 */
export const storeTokens = async (
  accessToken: string,
  refreshToken: string
): Promise<void> => {
  try {
    await Keychain.setGenericPassword(ACCESS_TOKEN_KEY, accessToken, {
      service: ACCESS_TOKEN_KEY,
    });
    await Keychain.setGenericPassword(REFRESH_TOKEN_KEY, refreshToken, {
      service: REFRESH_TOKEN_KEY,
    });
  } catch (error) {
    console.error("Error storing tokens:", error);
    throw new Error("Failed to store tokens");
  }
};

/**
 * Retrieve tokens from Keychain
 */
export const getTokens = async (): Promise<Tokens | null> => {
  try {
    const accessToken = await Keychain.getGenericPassword({
      service: ACCESS_TOKEN_KEY,
    });
    const refreshToken = await Keychain.getGenericPassword({
      service: REFRESH_TOKEN_KEY,
    });

    if (accessToken && refreshToken) {
      return {
        accessToken: accessToken.password,
        refreshToken: refreshToken.password,
      };
    }

    return null;
  } catch (error) {
    console.error("Error retrieving tokens:", error);
    return null;
  }
};

/**
 * Clear tokens from Keychain
 */
export const clearTokens = async (): Promise<void> => {
  try {
    await Keychain.resetGenericPassword({ service: ACCESS_TOKEN_KEY });
    await Keychain.resetGenericPassword({ service: REFRESH_TOKEN_KEY });
  } catch (error) {
    console.error("Error clearing tokens:", error);
    throw new Error("Failed to clear tokens");
  }
};
