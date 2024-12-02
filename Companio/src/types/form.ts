// frontend/src/types/form.ts

export interface FormData {
  basicInfo: {
    fullName: string;
    username: string;
    email: string;
  };
  preferences: {
    travelStyles: string[];
    interests: string[];
    activities: string[];
  };
  settings: {
    privacy: 'public' | 'private';
    notifications: {
      emailNotifications: boolean;
      pushNotifications: boolean;
    };
  };
  profilePicture: any;
  profilePictureUrl: string;
  bio?: string;
}
