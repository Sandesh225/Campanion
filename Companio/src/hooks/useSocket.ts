// src/hooks/useSocket.ts

import { useEffect } from "react";
import { useAuth } from "./useAuth"; // Custom hook to access AuthContext
import { useMatch } from "../context/MatchContext";
import {
  connectSocket,
  disconnectSocket,
  subscribeToNewMatches,
} from "../services/socket";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";

const useSocket = () => {
  const { isLoggedIn, userId } = useAuth();
  const { addMatch } = useMatch();

  useEffect(() => {
    if (isLoggedIn && userId) {
      connectSocket(userId);

      subscribeToNewMatches((matchData) => {
        addMatch(matchData);
        Toast.show({
          type: "success",
          text1: "New Match!",
          text2: `You have a new match with ${matchData.matchedProfileName}`,
        });
      });
    }

    return () => {
      disconnectSocket();
    };
  }, [isLoggedIn, userId, addMatch]);
};

export default useSocket;
