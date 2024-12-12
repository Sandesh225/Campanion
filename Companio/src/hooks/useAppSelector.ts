// src/hooks/useAppSelector.ts
import { TypedUseSelectorHook, useSelector } from "react-redux";
import type { RootState } from "../store/store"; // Correct import

// Use throughout your app instead of plain `useSelector`
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default useAppSelector;
