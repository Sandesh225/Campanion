import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { setCredentials, logOut } from "../components/Auth/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const logout = () => {
    dispatch(logOut());
    // Optionally clear tokens from storage
  };

  // Ensure auth is treated as an object
  if (typeof auth !== "object" || auth === null) {
    throw new Error("Auth state is not an object.");
  }

  return { ...auth, logout, setCredentials };
};
