import io from "socket.io-client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addMatch } from "../redux/matchesSlice";

const socket = io("http://localhost:3000", {
  // Add any necessary options
});

const useSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
      // Authenticate if needed
      socket.emit("authenticate", { token: "your-jwt-token" });
    });

    socket.on("new-match", (data) => {
      dispatch(addMatch(data));
      // Show notification banner
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);
};

export default useSocket;
