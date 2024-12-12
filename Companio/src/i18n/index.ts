// src/i18n/index.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Sample translations
const resources = {
  en: {
    translation: {
      welcome: "Welcome",
      login: "Login",
      register: "Register",
      logout: "Logout",
      dark_mode: "Dark Mode",
      dont_have_account: "Don't have an account?",
      email: "Email",
      password: "Password",
      // Add more translations as needed
    },
  },
  // Add other languages here
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;
