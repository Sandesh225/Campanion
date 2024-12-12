// src/hooks/useTypedNavigation.ts
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { MainStackParamList } from "../types/navigation";

export const useTypedNavigation = () =>
  useNavigation<NavigationProp<MainStackParamList>>();
